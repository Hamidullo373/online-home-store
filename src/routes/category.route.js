import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schema/category.schema.js";
import { Protected } from "../middleware/protected.middleware.js";
import { Roles } from "../middleware/roles.middleware.js";
import { ROLES } from "../constants/role.constants.js";

const categoryRouter = Router();

categoryRouter
  .get(
    "/",
    Protected(false),
    Roles(ROLES.ALL),
    categoryController.getAllCategories
  )
  .post(
    "/",
    Protected(true),
    Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
    ValidationMiddleware(createCategorySchema),
    categoryController.createCategory
  )
  .get(
    "/:id",
    Protected(false),
    Roles(ROLES.ALL),
    categoryController.getCategorybyId
  )
  .put(
    "/:id",
    Protected(true),
    Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
    ValidationMiddleware(updateCategorySchema),
    categoryController.updateCategory
  )
  .delete(
    "/:id",
    Protected(true),
    Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
    categoryController.deleteCategory
  );

export default categoryRouter;
