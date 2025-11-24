import {
  Controller,
  Get,
  Post,
  Put,
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
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  ReorderCategoriesDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('categories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Hanya admin yang bisa akses
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get semua categories (Admin only)' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
  })
  @ApiResponse({ status: 200, description: 'Daftar categories' })
  async findAll(@Query('includeInactive') includeInactive?: boolean) {
    return this.categoriesService.findAll(includeInactive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category detail' })
  @ApiResponse({ status: 404, description: 'Category tidak ditemukan' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create category baru (Admin only)' })
  @ApiResponse({ status: 201, description: 'Category berhasil dibuat' })
  @ApiResponse({ status: 409, description: 'Nama sudah digunakan' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put('reorder')
  @ApiOperation({ summary: 'Reorder categories (Admin only)' })
  @ApiResponse({ status: 200, description: 'Categories berhasil direorder' })
  async reorder(@Body() reorderDto: ReorderCategoriesDto) {
    return this.categoriesService.reorder(reorderDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category berhasil diupdate' })
  @ApiResponse({ status: 404, description: 'Category tidak ditemukan' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category berhasil dihapus' })
  @ApiResponse({ status: 400, description: 'Category memiliki artikel' })
  @ApiResponse({ status: 404, description: 'Category tidak ditemukan' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.delete(id);
  }
}
