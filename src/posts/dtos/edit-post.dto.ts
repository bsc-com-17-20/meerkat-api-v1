import { ApiProperty } from '@nestjs/swagger';
// import * as Joi from 'joi';

// export const editPostSchema = Joi.object({
//   title: Joi.string().alphanum().min(3).max(50).optional(),
//   content: Joi.string().optional(),
// }).options({
//   abortEarly: false,
// });

export class EditPostDto {
  @ApiProperty({ example: 'Arch-Linux vs Ubuntu Linux', required: false })
  title: string;
  @ApiProperty({
    example: 'Which one is the better linux distribution?',
    required: false,
  })
  content: string;
}
