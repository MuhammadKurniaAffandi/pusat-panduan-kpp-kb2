import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsObject,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus } from '@prisma/client';

export class UpdateArticleDto {
  @ApiPropertyOptional({ example: 'Cara Daftar NPWP Online (Update)' })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Judul minimal 5 karakter' })
  title?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID('4', { message: 'Format categoryId tidak valid' })
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Panduan lengkap pendaftaran NPWP' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({
    example: { type: 'doc', content: [] },
    description: 'Tiptap JSON content',
  })
  @IsOptional()
  @IsObject()
  content?: object;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  featuredImageUrl?: string;

  @ApiPropertyOptional({ enum: ArticleStatus, example: 'published' })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;
}
