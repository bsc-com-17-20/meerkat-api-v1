import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'luffy' })
  username: string;
  @ApiProperty({ example: 'Capta1nofTheStrawhat2' })
  password: string;
}
