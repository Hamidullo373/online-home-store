import { BaseException } from "../exception/base.exseption.js";
import Order from "../models/order.model.js";
import Clothes from "../models/homes.model.js";

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "_id username")
      .populate("orderItems.homesId", "name price");

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      userId: order.userId,
      orderItems: order.orderItems.map((item) => ({
        homesId: item.homesId,
        count: item.count,
      })),
      total_price: order.total_price,
      createdAt: order.createdAt,
    }));

    res.status(200).json({ message: "Success", orders: formattedOrders });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "_id username")
      .populate("orderItems.homesId", "name price");

    if (!order) {
      throw new BaseException(`Order is not found`);
    }

    const formattedOrder = {
      _id: order._id,
      userId: order.userId,
      orderItems: order.orderItems.map((item) => ({
        homesId: item.homesId,
        count: item.count,
      })),
      total_price: order.total_price,
      createdAt: order.createdAt,
    };

    res.status(200).json({ message: "Success", order: formattedOrder });
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { userId, orderItems } = req.body;

    if (!userId || !orderItems || orderItems.length === 0) {
      throw new BaseException(
        `All fields (userId, orderItems) must be provided`
      );
    }

    const homesIds = orderItems.map((item) => item.homesId);
    const homes = await Homes.find({ _id: { $in: homesIds } });

    if (homes.length !== orderItems.length) {
      throw new BaseException(`Some homes items were not found`);
    }

    const total_price = orderItems.reduce((sum, item) => {
      const home = homes.find((c) => c._id.toString() === item.homesId);
      return sum + home.price * item.count;
    }, 0);

    const newOrder = new Order({
      userId,
      orderItems,
      total_price,
    });

    await newOrder.save();

    res.status(201).json({ message: "Success", newOrder });
  } catch (err) {
    next(err);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.orderItems) {
      const homesIds = updateData.orderItems.map((item) => item.homesId);
      const homes = await Homes.find({ _id: { $in: homesIds } });

      if (homes.length !== updateData.orderItems.length) {
        throw new BaseException(`Some homes items were not found`);
      }

      updateData.total_price = updateData.orderItems.reduce((sum, item) => {
        const home = homes.find((c) => c._id.toString() === item.homesId);
        return sum + home.price * item.count;
      }, 0);
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      throw new BaseException(`Order is not found`);
    }

    res.status(200).json({
      message: "Order updated successfully",
      updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      throw new BaseException(`Order is not found`);
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const orderController = {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
export default orderController;
