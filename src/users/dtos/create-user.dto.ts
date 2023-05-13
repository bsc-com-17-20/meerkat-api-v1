import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  Max,
  Min,
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

export class CreateUserDto {
  @IsString()
  @IsAlphanumeric()
  @Min(3)
  @Max(30)
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @Min(8)
  @Max(100)
  @IsNotEmpty()
  password: string;
}
