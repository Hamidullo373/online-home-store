import { Router } from "express";
import orderController from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter
  .get("/", orderController.getOrders)
  .get("/:id", orderController.getOrderById)
  .post("/", orderController.createOrder)
  .put("/:id", orderController.updateOrder)
  .delete("/:id", orderController.deleteOrder);

export default orderRouter;
