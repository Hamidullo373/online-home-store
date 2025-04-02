import Order from "../models/order.model.js";

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId orderItems.homesId");
    res.status(200).json({ message: "Succes", orders });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({ message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId orderItems.homesId"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Succes", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { userId, orderItems, total_price } = req.body;

    if (!userId || !orderItems.length || !total_price) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const newOrder = new Order({ userId, orderItems, total_price });
    await newOrder.save();

    res.status(201).json({ message: "Succes", newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order updated successfully",
      updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
