import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user8' })
  @IsAlphanumeric()
  @MaxLength(30)
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'your@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsString()
  // role: string;

  @ApiProperty({ example: '12345678910' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsNotEmpty()
  password: string;
}
