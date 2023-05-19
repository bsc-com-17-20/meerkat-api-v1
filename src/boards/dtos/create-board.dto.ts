import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import * as Joi from 'joi';

export const createBoardSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  description: Joi.string().min(5).required(),
}).options({
  abortEarly: false,
});

export class CreateBoardDto {
  @ApiProperty({ example: 'Computer science' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'Anything and everything Computer' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string;
}
