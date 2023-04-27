import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const createBoardSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  description: Joi.string().min(5).required(),
}).options({
  abortEarly: false,
});

export class CreateBoardDto {
  @ApiProperty({ example: 'Computer science' })
  name: string;
  @ApiProperty({ example: 'Anything and everything Computer' })
  description: string;
}
