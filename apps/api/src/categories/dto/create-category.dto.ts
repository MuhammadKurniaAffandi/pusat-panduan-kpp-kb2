import { IsString, IsOptional, IsInt, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Pendaftaran NPWP' })
  @IsString()
  @MinLength(2, { message: 'Nama panduan layanan minimal 2 karakter' })
  name: string;

  @ApiPropertyOptional({ example: 'Panduan pendaftaran dan penerbitan NPWP' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Users',
    description: 'Nama icon dari Lucide',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 1, description: 'Urutan tampil' })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
