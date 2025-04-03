import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schema/category.schema.js";

const categoryRouter = Router();

categoryRouter
  .get("/", categoryController.getAllCategories)
  .post(
    "/",
    ValidationMiddleware(createCategorySchema),
    categoryController.createCategory
  )
  .get("/:id", categoryController.getCategorybyId)
  .put(
    "/:id",
    ValidationMiddleware(updateCategorySchema),
    categoryController.updateCategory
  )
  .delete("/:id", categoryController.deleteCategory);

export default categoryRouter;
