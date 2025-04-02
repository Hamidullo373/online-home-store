import { Router } from "express";
import userRouter from "./user.route.js";
import orderRouter from "./order.route.js";

const route = Router();

route.use("/users", userRouter);
route.use("/orders", orderRouter);

export default route;
