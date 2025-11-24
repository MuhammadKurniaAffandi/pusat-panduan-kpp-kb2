import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Membuat module ini tersedia di seluruh aplikasi
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
