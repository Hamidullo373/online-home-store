import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import {
  registerUserSchema,
  updateUserSchema,
  loginUserSchema,
} from "../schema/user.schema.js";

const userRouter = Router();

// Register route
userRouter.post(
  "/register",
  ValidationMiddleware(registerUserSchema),
  userController.register
);

// Login route
userRouter.post(
  "/login",
  ValidationMiddleware(loginUserSchema),
  userController.login
);

// Get all users
userRouter.get("/", userController.getAllUsers);

// Get user by ID
userRouter.get("/:id", userController.getOneUser);

// Update user by ID
userRouter.put(
  "/:id",
  ValidationMiddleware(updateUserSchema),
  userController.updateUser
);

// Delete user by ID
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
