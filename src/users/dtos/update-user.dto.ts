import * as Joi from 'joi';

export const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
}).options({
  abortEarly: false,
});

export class UpdateUserDto {
  username: string;
  email: string;
  password: string;
}
