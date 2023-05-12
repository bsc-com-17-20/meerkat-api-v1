import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const editBoardSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  description: Joi.string().min(5).optional(),
}).options({
  abortEarly: false,
});

export class EditBoardDto {
  @ApiProperty({ example: 'Food and nutrition', required: false })
  name: string;
  @ApiProperty({
    example: 'All things related to food and nutrition',
    required: false,
  })
  description: string;
}
