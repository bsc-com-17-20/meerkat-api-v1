import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const createBoardSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(50),
  content: Joi.string(),
}).options({
  abortEarly: false,
});

export class EditPostDto {
  @ApiProperty({ example: 'Arch-Linux vs Ubuntu Linux' })
  title: string;
  @ApiProperty({ example: 'Which one is the better linux distribution?' })
  content: string;
}
