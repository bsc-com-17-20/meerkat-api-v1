import { ApiProperty } from '@nestjs/swagger';
// import * as Joi from 'joi';

// export const createPostSchema = Joi.object({
//   title: Joi.string().alphanum().min(3).max(50).required(),
//   content: Joi.string().required(),
// }).options({
//   abortEarly: false,
// });

export class CreatePostDto {
  @ApiProperty({ example: 'Will AI replace programmers?' })
  title: string;
  @ApiProperty({
    example:
      'With the rise of new AI technologies that are powerful enough to write simple programs ' +
      'its not far fetched to think they might replace programmers soon. Thoughts?',
  })
  content: string;
}
