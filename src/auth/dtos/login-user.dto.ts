import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsAlphanumeric,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import * as Joi from 'joi';

export const loginUserSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(8).max(100).required(),
});

export class LoginUserDto {
  @ApiProperty({ example: 'luffy' })
  @IsString()
  @IsAlphanumeric()
  @Min(3)
  @Max(30)
  @IsOptional()
  username: string;
  @ApiProperty({ example: 'Capta1nofTheStrawhat2' })
  @IsString()
  @IsAlphanumeric()
  @Min(8)
  @Max(100)
  @IsOptional()
  password: string;
}
