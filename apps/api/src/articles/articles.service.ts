import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto, QueryArticlesDto } from './dto';
import { ArticleStatus } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate unique slug dari title
   */
  private generateSlug(title: string): string {
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'id',
    });

    return `${baseSlug}`;
  }

  /**
   * Get semua articles dengan filter dan pagination
   * - Admin: bisa lihat semua
   * - Staff: hanya artikel miliknya
   */
  async findAll(query: QueryArticlesDto, userId: string, userRole: string) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      categoryId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: {
      authorId?: string;
      status?: ArticleStatus;
      categoryId?: string;
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        excerpt?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    // Staff hanya bisa lihat artikel miliknya
    if (userRole === 'staff') {
      where.authorId = userId;
    }

    // ✅ FIX: Filter by status hanya jika status ada dan bukan empty string
    if (status && status.trim() !== '') {
      where.status = status;
    }

    // ✅ FIX: Filter by category hanya jika categoryId ada dan bukan empty string
    if (categoryId && categoryId.trim() !== '') {
      where.categoryId = categoryId;
    }

    // Search by title or excerpt
    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: { [key: string]: 'asc' | 'desc' } = {};
    orderBy[sortBy] = sortOrder;

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get article by ID
   */
  async findById(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Informasi layanan tidak ditemukan');
    }

    return article;
  }

  /**
   * Get article by slug (untuk public)
   */
  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug, status: ArticleStatus.published }, // ✅ Only published
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Informasi layanan tidak ditemukan');
    }

    return article;
  }

  /**
   * Create article baru
   */
  async create(createArticleDto: CreateArticleDto, authorId: string) {
    const { title, categoryId, excerpt, content, status } = createArticleDto;

    // Cek category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Panduan layanan tidak ditemukan');
    }

    // Generate unique slug
    const slug = this.generateSlug(title);

    // Set publishedAt jika status published
    const publishedAt = status === ArticleStatus.published ? new Date() : null;

    const article = await this.prisma.article.create({
      data: {
        title,
        slug,
        categoryId,
        authorId,
        excerpt,
        content,
        status: status || ArticleStatus.draft,
        publishedAt,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return article;
  }

  /**
   * Update article
   */
  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
    userRole: string,
  ) {
    const article = await this.findById(id);

    // Cek ownership jika bukan admin
    if (userRole !== 'admin' && article.author.id !== userId) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses ke Informasi layanan ini',
      );
    }

    const { title, categoryId, ...rest } = updateArticleDto;
    const updateData: { [key: string]: any } = { ...rest };

    // Update slug jika title diupdate
    if (title) {
      updateData.title = title;
      updateData.slug = this.generateSlug(title);
    }

    // Cek category jika diupdate
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Panduan layanan tidak ditemukan');
      }
      updateData.categoryId = categoryId;
    }

    // Set publishedAt jika status berubah ke published
    if (
      updateArticleDto.status === ArticleStatus.published &&
      article.status !== ArticleStatus.published
    ) {
      updateData.publishedAt = new Date();
    }

    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return updatedArticle;
  }

  /**
   * Delete article
   */
  async delete(id: string, userId: string, userRole: string) {
    const article = await this.findById(id);

    // Cek ownership jika bukan admin
    if (userRole !== 'admin' && article.author.id !== userId) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses ke informasi layanan ini',
      );
    }

    await this.prisma.article.delete({
      where: { id },
    });

    return { message: 'Informasi layanan berhasil dihapus' };
  }

  /**
   * Publish article
   */
  async publish(id: string, userId: string, userRole: string) {
    const article = await this.findById(id);

    // Cek ownership jika bukan admin
    if (userRole !== 'admin' && article.author.id !== userId) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses ke informasi layanan ini',
      );
    }

    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: {
        status: ArticleStatus.published,
        publishedAt: article.publishedAt || new Date(),
      },
      include: {
        author: {
          select: { id: true, fullName: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return updatedArticle;
  }

  /**
   * Archive article
   */
  async archive(id: string, userId: string, userRole: string) {
    const article = await this.findById(id);

    // Cek ownership jika bukan admin
    if (userRole !== 'admin' && article.author.id !== userId) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses ke informasi layanan ini',
      );
    }

    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: {
        status: ArticleStatus.archived,
      },
      include: {
        author: {
          select: { id: true, fullName: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return updatedArticle;
  }
}
