import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import * as Joi from 'joi';

export const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .optional(),
}).options({
  abortEarly: false,
});

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsAlphanumeric()
  @Min(3)
  @Max(30)
  @IsOptional()
  username: string;

  @ApiPropertyOptional()
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsAlphanumeric()
  @Min(8)
  @Max(100)
  @IsOptional()
  password: string;
}
