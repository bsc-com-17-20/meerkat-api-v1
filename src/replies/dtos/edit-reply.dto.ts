import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
// import * as Joi from 'joi';

// export const editReplySchema = Joi.object({
//   content: Joi.string().required(),
// }).options({
//   abortEarly: false,
// });

export class EditReplyDto {
  @ApiProperty({ example: 'Mind giving it a 100/100 please' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
