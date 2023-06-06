import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength } from 'class-validator';
import * as Joi from 'joi';

export const loginUserSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(8).max(100).required(),
});

export class LoginUserDto {
  @ApiProperty({ example: 'user8' })
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: '12345678910' })
  @MinLength(8)
  password: string;
}
