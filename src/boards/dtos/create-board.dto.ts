import * as Joi from 'joi';

export const createBoardSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  description: Joi.string().min(5).required(),
}).options({
  abortEarly: false,
});

export interface CreateBoardDto {
  name: string;
  description: string;
}
