import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsObject,
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
    example: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Judul Artikel' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Isi artikel...' }],
        },
      ],
    },
    description: 'Tiptap JSON content',
  })
  @IsObject()
  content: object;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    enum: ArticleStatus,
    example: 'draft',
    default: 'draft',
  })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;
}
