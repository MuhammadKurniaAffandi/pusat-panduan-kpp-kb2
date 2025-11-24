import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, QueryArticlesDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('articles')
@ApiBearerAuth('JWT-auth')
@Controller('articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @Roles('admin', 'staff')
  @ApiOperation({
    summary: 'Get semua articles (Admin: semua, Staff: miliknya)',
  })
  @ApiResponse({ status: 200, description: 'Daftar articles' })
  async findAll(
    @Query() query: QueryArticlesDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.articlesService.findAll(query, userId, userRole);
  }

  @Get(':id')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({ status: 200, description: 'Article detail' })
  @ApiResponse({ status: 404, description: 'Article tidak ditemukan' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.articlesService.findById(id);
  }

  @Post()
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Create article baru' })
  @ApiResponse({ status: 201, description: 'Article berhasil dibuat' })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.articlesService.create(createArticleDto, userId);
  }

  @Put(':id')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Update article (Admin: semua, Staff: miliknya)' })
  @ApiResponse({ status: 200, description: 'Article berhasil diupdate' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki akses' })
  @ApiResponse({ status: 404, description: 'Article tidak ditemukan' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.articlesService.update(id, updateArticleDto, userId, userRole);
  }

  @Patch(':id/publish')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Publish article' })
  @ApiResponse({ status: 200, description: 'Article berhasil dipublish' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki akses' })
  async publish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.articlesService.publish(id, userId, userRole);
  }

  @Patch(':id/archive')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Archive article' })
  @ApiResponse({ status: 200, description: 'Article berhasil diarchive' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki akses' })
  async archive(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.articlesService.archive(id, userId, userRole);
  }

  @Delete(':id')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Delete article (Admin: semua, Staff: miliknya)' })
  @ApiResponse({ status: 200, description: 'Article berhasil dihapus' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki akses' })
  @ApiResponse({ status: 404, description: 'Article tidak ditemukan' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.articlesService.delete(id, userId, userRole);
  }
}
