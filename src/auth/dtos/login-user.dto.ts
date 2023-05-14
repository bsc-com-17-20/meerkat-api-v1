import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsAlphanumeric,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import * as Joi from 'joi';

export const loginUserSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(8).max(100).required(),
});

export class LoginUserDto {
  @ApiProperty({ example: 'luffy' })
  username: string;

  @ApiProperty({ example: 'Capta1nofTheStrawhat2' })
  password: string;
}
