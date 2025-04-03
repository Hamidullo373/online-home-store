import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  categoryId: Joi.string().optional(),
}).required();

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(4).max(50).required(),
}).required();
