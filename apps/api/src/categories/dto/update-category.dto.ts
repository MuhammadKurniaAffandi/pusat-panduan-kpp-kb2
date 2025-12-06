import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Pendaftaran NPWP' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Nama panduan layanan minimal 2 karakter' })
  name?: string;

  @ApiPropertyOptional({ example: 'Panduan pendaftaran dan penerbitan NPWP' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Users' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
