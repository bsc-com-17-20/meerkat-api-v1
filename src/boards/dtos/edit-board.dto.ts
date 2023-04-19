import { ApiProperty } from '@nestjs/swagger';

export class EditBoardDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
