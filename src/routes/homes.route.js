import { Router } from "express";
import homesController from "../controllers/homes.controler.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import {
  createHomesSchema,
  updateHomesSchema,
} from "../schema/homes.schema.js";
import { authenticate } from "../middleware/auth.middleware.js";

const homesRouter = Router();

homesRouter
  .get("/", homesController.getAllHomes)
  .get("/:id", homesController.getOneHomes)
  .post(
    "/",
    authenticate,
    ValidationMiddleware(createHomesSchema),
    homesController.createHomes
  )
  .patch(
    "/:id",
    authenticate,
    ValidationMiddleware(updateHomesSchema),
    homesController.updateHomes
  )
  .delete("/:id", authenticate, homesController.deleteHomes);

export default homesRouter;
