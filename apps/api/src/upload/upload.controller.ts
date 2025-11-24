import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('upload')
@ApiBearerAuth('JWT-auth')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @Roles('admin', 'staff')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload gambar untuk artikel' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Gambar berhasil diupload' })
  @ApiResponse({ status: 400, description: 'File tidak valid' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }
    return this.uploadService.uploadImage(file);
  }

  @Delete(':fileName')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Delete gambar' })
  @ApiResponse({ status: 200, description: 'Gambar berhasil dihapus' })
  async deleteImage(@Param('fileName') fileName: string) {
    return this.uploadService.deleteImage(fileName);
  }
}
