import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class UploadService {
  private supabase: ReturnType<typeof createClient> | null = null;
  private uploadDir: string;
  private useSupabase: boolean;
  private bucketName = 'content-images';

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    this.useSupabase = !!(supabaseUrl && supabaseKey);

    if (this.useSupabase) {
      // type narrowing: sekarang supabaseUrl dan supabaseKey bertipe string pasti
      const url: string = supabaseUrl;
      const key: string = supabaseKey;

      this.supabase = createClient(url, key);

      void this.initBucket();
      console.log('✔ Using Supabase Storage for file uploads');
    } else {
      this.uploadDir = path.join(process.cwd(), 'uploads', 'images');
      if (!fsSync.existsSync(this.uploadDir)) {
        fsSync.mkdirSync(this.uploadDir, { recursive: true });
      }
      console.log('✔ Using local filesystem for file uploads');
    }
  }

  /**
   * Initialize Supabase bucket (production only)
   */
  private async initBucket() {
    const supabase = this.supabase;
    if (!supabase) return;

    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === this.bucketName);

      if (!exists) {
        await supabase.storage.createBucket(this.bucketName, {
          public: true,
        });
        console.log(`✔ Created Supabase bucket: ${this.bucketName}`);
      }
    } catch (error) {
      console.error('✖ Failed to initialize Supabase bucket:', error);
    }
  }

  /**
   * Upload image
   */
  async uploadImage(file: Express.Multer.File) {
    this.validateFile(file);

    if (this.useSupabase && this.supabase) {
      return this.uploadToSupabase(file);
    }

    return this.uploadToLocal(file);
  }

  /**
   * Upload to Supabase
   */
  private async uploadToSupabase(file: Express.Multer.File) {
    const supabase = this.supabase;
    if (!supabase)
      throw new InternalServerErrorException('Supabase not initialized');

    const ext = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = `images/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: data.path,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Gagal upload ke Supabase: ${error}`,
      );
    }
  }

  /**
   * Upload to local filesystem
   */
  private async uploadToLocal(file: Express.Multer.File) {
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);

    try {
      await fs.writeFile(filePath, file.buffer);

      const baseUrl = this.configService.get<string>(
        'API_URL',
        'http://localhost:3001',
      );
      const url = `${baseUrl}/uploads/images/${fileName}`;

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
   * Delete image
   */
  async deleteImage(filePathOrName: string) {
    if (this.useSupabase && this.supabase) {
      return this.deleteFromSupabase(filePathOrName);
    }
    return this.deleteFromLocal(filePathOrName);
  }

  /**
   * Delete from Supabase
   */
  private async deleteFromSupabase(filePath: string) {
    const supabase = this.supabase;
    if (!supabase)
      throw new InternalServerErrorException('Supabase not initialized');

    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) throw error;

      return { success: true, message: 'File berhasil dihapus' };
    } catch (error) {
      throw new InternalServerErrorException(`Gagal hapus file: ${error}`);
    }
  }

  /**
   * Delete from local filesystem
   */
  private async deleteFromLocal(fileName: string) {
    const filePath = path.join(this.uploadDir, fileName);

    try {
      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        await fs.unlink(filePath);
      }

      return { success: true, message: 'File berhasil dihapus' };
    } catch (error) {
      throw new InternalServerErrorException(`Gagal menghapus file: ${error}`);
    }
  }

  /**
   * Validate file
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
