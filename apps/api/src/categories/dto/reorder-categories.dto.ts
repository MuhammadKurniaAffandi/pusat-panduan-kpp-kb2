import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderCategoriesDto {
  @ApiProperty({
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    description: 'Array of panduan layanan IDs dalam urutan baru',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds: string[];
}
