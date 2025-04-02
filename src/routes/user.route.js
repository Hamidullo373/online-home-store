import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const userRouter = Router();

userRouter
  .get("/", UserController.getAllUsers)
  .get("/:id", UserController.getOneUser)
  .post("/", UserController.createUser)
  .put("/:id", UserController.updateUser)
  .delete("/:id", UserController.deleteUser);

export default userRouter;
