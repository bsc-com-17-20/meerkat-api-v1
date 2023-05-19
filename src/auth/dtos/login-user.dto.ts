import { ApiProperty } from '@nestjs/swagger';
import { minLength, MinLength, MaxLength } from 'class-validator';
import * as Joi from 'joi';

export const loginUserSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(8).max(100).required(),
});

export class LoginUserDto {
  @ApiProperty({ example: 'luffy' })
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: 'Capta1nofTheStrawhat2' })
  @MinLength(8)
  password: string;
}
