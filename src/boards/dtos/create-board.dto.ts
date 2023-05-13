import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
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
  @IsAlphanumeric()
  @Min(3)
  @Max(30)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Anything and everything Computer' })
  @IsString()
  @Min(5)
  @IsNotEmpty()
  description: string;
}
