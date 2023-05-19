import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
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

// used to manually set a role for a user
export class CreateFullUserDto {
  @IsAlphanumeric()
  @MaxLength(30)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  role: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsNotEmpty()
  password: string;
}
