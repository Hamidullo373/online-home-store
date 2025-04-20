import Joi from "joi";

// Validation Schemas
export const createOrderSchema = Joi.object({
  userId: Joi.string().length(24).required(),
  orderItems: Joi.array()
    .items(
      Joi.object({
        homesId: Joi.string().length(24).required(),
        count: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

export const updateOrderSchema = Joi.object({
  userId: Joi.string().length(24),
  orderItems: Joi.array().items(
    Joi.object({
      homesId: Joi.string().length(24),
      count: Joi.number().integer().min(1),
    })
  ),
  total_price: Joi.number().positive(),
  status: Joi.string().valid("pending", "sold", "cancelled"),
});
