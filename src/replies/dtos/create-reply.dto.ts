import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import * as Joi from 'joi';

export class CreateReplyDto {
  @ApiProperty({ example: 'Its worth 100/100 right?' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export const createReplySchema = Joi.object({
  content: Joi.string(),
});
