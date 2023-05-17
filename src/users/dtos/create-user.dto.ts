import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
  // @IsAlphanumeric()
  // @IsNotEmpty()
  username: string;

  // @IsEmail()
  // @IsNotEmpty()
  email: string;

  // @IsNotEmpty()
  password: string;
}

// used to manually set a role for a user
export class CreateFullUserDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  role: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
