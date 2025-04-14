import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../schema/user.schema.js";
import { Roles } from "../middleware/roles.middleware.js";
import { ROLES } from "../constants/role.constants.js";
import { Protected } from "../middleware/protected.middleware.js";

const userRouter = Router();

userRouter
  .get(
    "/",
    Protected(true),
    Roles(ROLES.RESTAURANT_OWNER, ROLES.SUPER_ADMIN),
    userController.getAllUsers
  )
  .post(
    "/register",
    Protected(false),
    Roles(ROLES.ALL),
    ValidationMiddleware(registerSchema),
    userController.register
  )
  .post(
    "/login",
    Protected(false),
    Roles(ROLES.ALL),
    ValidationMiddleware(loginSchema),
    userController.login
  )
  .post(
    "/forgot-password",
    Protected(false),
    Roles(ROLES.ALL),
    userController.forgotPassword
  )
  .post(
    "/reset-password",
    Protected(false),
    Roles(ROLES.ALL),
    userController.resetPassword
  )
  .post(
    "/refresh",
    Protected(false),
    Roles(ROLES.ALL),
    ValidationMiddleware(refreshSchema),
    userController.refresh
  );

export default userRouter;
