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
    summary: 'Get semua Informasi Layanan (Admin: semua, Staff: miliknya)',
  })
  @ApiResponse({ status: 200, description: 'Daftar Informasi Layanan' })
  async findAll(
    @Query() query: QueryArticlesDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.articlesService.findAll(query, userId, userRole);
  }

  @Get(':id')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get Informasi Layanan by ID' })
  @ApiResponse({ status: 200, description: 'Informasi Layanan detail' })
  @ApiResponse({
    status: 404,
    description: 'Informasi Layanan tidak ditemukan',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.articlesService.findById(id);
  }

  @Post()
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Create Informasi Layanan baru' })
  @ApiResponse({
    status: 201,
    description: 'Informasi Layanan berhasil dibuat',
  })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.articlesService.create(createArticleDto, userId);
  }

  @Put(':id')
  @Roles('admin', 'staff')
  @ApiOperation({
    summary: 'Update Informasi Layanan (Admin: semua, Staff: miliknya)',
  })
  @ApiResponse({
    status: 200,
    description: 'Informasi Layanan berhasil diupdate',
  })
  @ApiResponse({ status: 403, description: 'Tidak memiliki akses' })
  @ApiResponse({
    status: 404,
    description: 'Informasi Layanan tidak ditemukan',
  })
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
  @ApiOperation({ summary: 'Publish Informasi Layanan' })
  @ApiResponse({
    status: 200,
    description: 'Informasi Layanan berhasil dipublish',
  })
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
  @ApiOperation({ summary: 'Archive Informasi Layanan' })
  @ApiResponse({
    status: 200,
    description: 'Informasi Layanan berhasil diarchive',
  })
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
  @ApiOperation({
    summary: 'Delete Informasi Layanan (Admin: semua, Staff: miliknya)',
  })
  @ApiResponse({
    status: 200,
    description: 'Informasi Layanan berhasil dihapus',
  })
  @ApiResponse({ status: 403, description: 'Tidak memiliki akses' })
  @ApiResponse({
    status: 404,
    description: 'Informasi Layanan tidak ditemukan',
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.articlesService.delete(id, userId, userRole);
  }
}
