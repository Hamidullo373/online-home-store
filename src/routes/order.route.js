import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import { createOrderSchema } from "../schema/order.schema.js";
import { Protected } from "../middleware/protected.middleware.js";
import { Roles } from "../middleware/roles.middleware.js";
import { ROLES } from "../constants/role.constants.js";

const orderRouter = Router();

orderRouter
  .get(
    "/",
    Protected(true),
    Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
    orderController.getOrders
  )
  .get("/:id", Protected(true), Roles(ROLES.ALL), orderController.getOrderById)
  .post(
    "/",
    Protected(true),
    Roles(ROLES.ALL),
    ValidationMiddleware(createOrderSchema),
    orderController.createOrder
  )
  .put("/:id", Protected(true), Roles(ROLES.ALL), orderController.updateOrder)
  .delete(
    "/:id",
    Protected(true),
    Roles(ROLES.ALL),
    orderController.deleteOrder
  );

export default orderRouter;
