import * as Joi from 'joi';

export const createReplySchema = Joi.object({
  content: Joi.string().alphanum().required(),
}).options({
  abortEarly: false,
});

export class CreateReplyDto {
  content: string;
}
