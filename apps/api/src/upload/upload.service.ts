import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs'; // ✅ Use fs.promises for async
import * as fsSync from 'fs'; // ✅ Keep sync for initial check
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Tipe file yang diizinkan
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class UploadService {
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    // Set upload directory
    this.uploadDir = path.join(process.cwd(), 'uploads');

    // Buat folder jika belum ada (sync OK di constructor)
    if (!fsSync.existsSync(this.uploadDir)) {
      fsSync.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Upload single image (Local Storage untuk Development)
   */
  async uploadImage(file: Express.Multer.File) {
    // Validasi file
    this.validateFile(file);

    // Generate unique filename
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);

    try {
      // ✅ Simpan file async
      await fs.writeFile(filePath, file.buffer);

      // Generate URL
      const baseUrl = this.configService.get<string>(
        'API_URL',
        'http://localhost:3001',
      );
      const url = `${baseUrl}/uploads/${fileName}`;

      return {
        url,
        path: fileName,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Gagal menyimpan file: ${error}`);
    }
  }

  /**
   * Delete image dari local storage
   */
  async deleteImage(fileName: string) {
    const filePath = path.join(this.uploadDir, fileName);

    try {
      // ✅ Check file exists async
      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        // ✅ Delete file async
        await fs.unlink(filePath);
      }

      return { success: true, message: 'File berhasil dihapus' };
    } catch (error) {
      throw new InternalServerErrorException(`Gagal menghapus file ${error}`);
    }
  }

  /**
   * Validasi file upload
   */
  private validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipe file tidak diizinkan. Gunakan: JPG, PNG, GIF, atau WebP',
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('Ukuran file maksimal 5MB');
    }
  }
}
