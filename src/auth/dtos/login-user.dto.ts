import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const loginUserSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(8).max(30).required(),
});

export class LoginUserDto {
  @ApiProperty({ example: 'luffy' })
  username: string;
  @ApiProperty({ example: 'Capta1nofTheStrawhat2' })
  password: string;
}
