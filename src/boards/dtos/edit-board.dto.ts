import * as Joi from 'joi';

export const editBoardSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  description: Joi.string().min(5),
}).options({
  abortEarly: false,
});

export interface EditBoardDto {
  name: string;
  description: string;
}
