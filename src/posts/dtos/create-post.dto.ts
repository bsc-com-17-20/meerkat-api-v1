import * as Joi from 'joi';

export const createPostSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(50).required(),
  content: Joi.string().required(),
}).options({
  abortEarly: false,
});

export interface CreatePostDto {
  title: string;
  content: string;
}
