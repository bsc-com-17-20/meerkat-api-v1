import * as Joi from 'joi';

export class CreateReplyDto {
  content: string;
}

export const createReplySchema = Joi.object({
  content: Joi.string(),
});
