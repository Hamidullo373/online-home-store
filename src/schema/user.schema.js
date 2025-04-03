import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string()
    .pattern(
      /^(9[012345789]|6[125679]|7[01234569]|3[3]|8[8]|2[0]|5[05])[0-9]{7}$/
    )
    .required(),
  gender: Joi.string().valid("male", "female").required(),
  birthDate: Joi.date().less("now").required(),
});

export const loginUserSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(
      /^(9[012345789]|6[125679]|7[01234569]|3[3]|8[8]|2[0]|5[05])[0-9]{7}$/
    )
    .required(),
  password: Joi.string().min(8).required(),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(50),
  phoneNumber: Joi.string().pattern(
    /^(9[012345789]|6[125679]|7[01234569]|3[3]|8[8]|2[0]|5[05])[0-9]{7}$/
  ),
  password: Joi.string().min(8),
});
