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
  ParseBoolPipe,
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
  @ApiOperation({ summary: 'Get semua Panduan Layanan (Admin only)' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
  })
  @ApiResponse({ status: 200, description: 'Daftar Panduan Layanan' })
  async findAll(
    @Query('includeInactive', new ParseBoolPipe({ optional: true }))
    includeInactive?: boolean,
  ) {
    // Default true untuk admin (menampilkan semua)
    const shouldInclude = includeInactive ?? true;
    return this.categoriesService.findAll(shouldInclude);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Panduan Layanan by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Panduan Layanan detail' })
  @ApiResponse({ status: 404, description: 'Panduan Layanan tidak ditemukan' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Panduan Layanan baru (Admin only)' })
  @ApiResponse({ status: 201, description: 'Panduan Layanan berhasil dibuat' })
  @ApiResponse({
    status: 409,
    description: 'Nama Panduan Layanan sudah digunakan',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put('reorder')
  @ApiOperation({ summary: 'Reorder Panduan Layanan (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Panduan Layanan berhasil direorder',
  })
  async reorder(@Body() reorderDto: ReorderCategoriesDto) {
    return this.categoriesService.reorder(reorderDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Panduan Layanan (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Panduan Layanan berhasil diupdate',
  })
  @ApiResponse({ status: 404, description: 'Panduan Layanan tidak ditemukan' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Panduan Layanan (Admin only)' })
  @ApiResponse({ status: 200, description: 'Panduan Layanan berhasil dihapus' })
  @ApiResponse({ status: 400, description: 'Panduan Layanan memiliki artikel' })
  @ApiResponse({ status: 404, description: 'Panduan Layanan tidak ditemukan' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.delete(id);
  }
}
