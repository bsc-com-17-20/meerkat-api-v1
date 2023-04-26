import * as Joi from 'joi';

export const createBoardSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(50),
  content: Joi.string(),
}).options({
  abortEarly: false,
});

export interface EditPostDto {
  title: string;
  content: string;
}
