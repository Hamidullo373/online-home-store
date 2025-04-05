import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import { Protected } from "../middleware/protected.middleware.js";
import {
  registerUserSchema,
  updateUserSchema,
  loginUserSchema,
} from "../schema/user.schema.js";
import { Roles } from "../middleware/roles.middleware.js";
import { ROLES } from "../constants/role.constants.js";

const userRouter = Router();

userRouter.post(
  "/register",
  Protected(false),
  Roles(ROLES.ALL),
  ValidationMiddleware(registerUserSchema),
  userController.register
);

userRouter.post(
  "/login",
  Protected(false),
  Roles(ROLES.ALL),
  ValidationMiddleware(loginUserSchema),
  userController.login
);

userRouter.get(
  "/",
  Protected(false),
  Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
  userController.getAllUsers
);

userRouter.get(
  "/:id",
  Protected(false),
  Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
  userController.getOneUser
);

userRouter.put(
  "/:id",
  Protected(true),
  Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
  ValidationMiddleware(updateUserSchema),
  userController.updateUser
);

userRouter.delete(
  "/:id",
  Protected(true),
  Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
  userController.deleteUser
);

export default userRouter;
