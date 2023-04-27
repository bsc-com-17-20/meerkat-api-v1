import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
}).options({
  abortEarly: false,
});

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
}
