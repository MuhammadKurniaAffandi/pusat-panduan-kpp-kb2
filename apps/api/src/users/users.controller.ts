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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Hanya admin yang bisa akses semua endpoint users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get semua users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Daftar users' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(page || 1, limit || 10, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User detail' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user baru (Admin only)' })
  @ApiResponse({ status: 201, description: 'User berhasil dibuat' })
  @ApiResponse({ status: 409, description: 'Email sudah digunakan' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User berhasil diupdate' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user / soft delete (Admin only)' })
  @ApiResponse({ status: 200, description: 'User berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  /* Di bawah ini Code lama */
  /* async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  } */

  /* Tambahan Code Baru Untuk Soft Delete */
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    // Kita gunakan soft delete sebagai default DELETE
    return this.usersService.softDelete(id);
  }

  /* Tambahan Code Baru untuk Hard Delete */
  @Delete('hard/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus user permanen (Hard Delete) (Admin only)' })
  @ApiResponse({ status: 200, description: 'User berhasil dihapus permanen' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async hardDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.hardDelete(id);
  }
}
