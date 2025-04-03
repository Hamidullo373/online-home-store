import { Router } from "express";
import userRouter from "./user.route.js";
import categoryRouter from "./category.route.js";
import homesRouter from "./homes.route.js";

const route = Router();

route
  .use("/users", userRouter)
  .use("/categories", categoryRouter)
  .use("/homes", homesRouter);

export default route;
