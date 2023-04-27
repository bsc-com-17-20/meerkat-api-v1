import * as Joi from 'joi';

export const editReplySchema = Joi.object({
  content: Joi.string().required(),
}).options({
  abortEarly: false,
});

export class EditReplyDto {
  content: string;
}
