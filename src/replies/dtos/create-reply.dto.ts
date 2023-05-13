import { IsNotEmpty, IsString } from 'class-validator';
import * as Joi from 'joi';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export const createReplySchema = Joi.object({
  content: Joi.string(),
});
