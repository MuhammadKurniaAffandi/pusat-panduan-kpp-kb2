import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus } from '@prisma/client';

export class CreateArticleDto {
  @ApiProperty({ example: 'Cara Daftar NPWP Online' })
  @IsString()
  @MinLength(5, { message: 'Judul minimal 5 karakter' })
  title: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID kategori',
  })
  @IsUUID('4', { message: 'Format categoryId tidak valid' })
  categoryId: string;

  @ApiPropertyOptional({
    example: 'Panduan lengkap pendaftaran NPWP secara online',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({
    example: '<h1>Judul Artikel</h1><p>Isi artikel...</p>',
    description: 'HTML content string',
  })
  @IsString()
  @MinLength(1, { message: 'Content tidak boleh kosong' })
  content: string;

  @ApiPropertyOptional({
    enum: ArticleStatus,
    example: 'draft',
    default: 'draft',
  })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;
}
