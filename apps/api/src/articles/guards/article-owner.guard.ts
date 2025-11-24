import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArticleOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const articleId = request.params.id;

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
      throw new NotFoundException('Artikel tidak ditemukan');
    }

    if (article.authorId !== user.id) {
      throw new ForbiddenException('Anda tidak memiliki akses ke artikel ini');
    }

    return true;
  }
}
