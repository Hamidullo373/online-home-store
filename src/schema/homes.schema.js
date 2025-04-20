import Joi from "joi";

export const createHomesSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().max(500),
  imageUrl: Joi.string().uri(),
  category: Joi.string().required(),
  location: Joi.string().min(3).max(100).required(),
});

export const updateHomesSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  price: Joi.number().positive(),
  description: Joi.string().max(500),
  imageUrl: Joi.string().uri(),
  category: Joi.string(),
  location: Joi.string().min(3).max(100).required(),
});
