import Joi from 'joi';
//joi is a schema description language for data validation.
export const userValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(1).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(36).required(),
  name: Joi.string().min(1).max(45),
});