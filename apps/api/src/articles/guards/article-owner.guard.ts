import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface RequestWithUser extends Request {
  user: {
    id: string;
    role: 'admin' | 'staff';
    email: string;
  };
  params: {
    id: string;
  };
}

@Injectable()
export class ArticleOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const articleId = request.params?.id;

    if (!articleId) {
      throw new BadRequestException('ID informasi layanan tidak ditemukan');
    }

    // Admin dapat akses semua artikel
    if (user.role === 'admin') {
      return true;
    }

    // Cek apakah artikel ada dan milik user
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      select: { authorId: true },
    });

    if (!article) {
      throw new NotFoundException('Informasi Layanan tidak ditemukan');
    }

    if (article.authorId !== user.id) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses ke informasi layanan ini',
      );
    }

    return true;
  }
}
