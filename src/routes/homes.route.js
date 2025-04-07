import { Router } from "express";
import homesController from "../controllers/homes.controler.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import {
  createHomesSchema,
  updateHomesSchema,
} from "../schema/homes.schema.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { Protected } from "../middleware/protected.middleware.js";
import { Roles } from "../middleware/roles.middleware.js";
import { ROLES } from "../constants/role.constants.js";
import upload from "../config/multer.config.js";

const homesRouter = Router();

homesRouter
  .get("/", Protected(false), Roles(ROLES.ALL), homesController.getAllHomes)
  .get("/:id", Protected(false), Roles(ROLES.ALL), homesController.getOneHomes)
  .post(
    "/",
    Protected(true),
    authenticate,
    Roles(ROLES.ALL),
    upload.single("imageUrl"),
    ValidationMiddleware(createHomesSchema),
    homesController.createHomes
  )
  .patch(
    "/:id",
    Protected(true),
    authenticate,
    Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
    ValidationMiddleware(updateHomesSchema),
    homesController.updateHomes
  )
  .delete(
    "/:id",
    Protected(true),
    Roles(ROLES.STORE_OWNER, ROLES.SUPER_ADMIN),
    authenticate,
    homesController.deleteHomes
  );

export default homesRouter;
