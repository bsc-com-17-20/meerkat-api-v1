import { IsNotEmpty, IsString } from 'class-validator';
import * as Joi from 'joi';

export const editReplySchema = Joi.object({
  content: Joi.string().required(),
}).options({
  abortEarly: false,
});

export class EditReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
