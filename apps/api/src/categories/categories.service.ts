import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  ReorderCategoriesDto,
} from './dto';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate slug dari nama kategori
   */
  private generateSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'id',
    });
  }

  /**
   * Get semua categories (untuk admin)
   */
  async findAll(includeInactive = true) {
    const where = includeInactive ? {} : { isActive: true };

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return categories.map((category) => ({
      ...category,
      articleCount: category._count.articles,
      _count: undefined,
    }));
  }

  /**
   * Get category by ID
   */
  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Panduan Layanan tidak ditemukan');
    }

    return {
      ...category,
      articleCount: category._count.articles,
      _count: undefined,
    };
  }

  /**
   * Get category by slug
   */
  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Panduan Layanan tidak ditemukan');
    }

    return {
      ...category,
      articleCount: category._count.articles,
      _count: undefined,
    };
  }

  /**
   * Create category baru
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description, icon, displayOrder } = createCategoryDto;

    // Generate slug
    const slug = this.generateSlug(name);

    // Cek nama atau slug sudah ada
    const existing = await this.prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existing) {
      throw new ConflictException('Nama Panduan Layanan sudah digunakan');
    }

    // Get max displayOrder jika tidak disediakan
    let order = displayOrder;
    if (order === undefined) {
      const maxOrder = await this.prisma.category.aggregate({
        _max: { displayOrder: true },
      });
      order = (maxOrder._max.displayOrder || 0) + 1;
    }

    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        displayOrder: order,
      },
    });

    return category;
  }

  /**
   * Update category
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findById(id);

    const { name, ...rest } = updateCategoryDto;
    const updateData: Record<string, any> = { ...rest };

    // Update slug jika nama diupdate
    if (name) {
      const slug = this.generateSlug(name);

      // Cek konflik nama/slug
      const existing = await this.prisma.category.findFirst({
        where: {
          OR: [{ name }, { slug }],
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Nama Panduan Layanan sudah digunakan');
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return {
      ...category,
      articleCount: category._count.articles,
      _count: undefined,
    };
  }

  /**
   * Reorder categories
   */
  async reorder(reorderDto: ReorderCategoriesDto) {
    const { categoryIds } = reorderDto;

    // Update displayOrder untuk setiap category
    await Promise.all(
      categoryIds.map((id, index) =>
        this.prisma.category.update({
          where: { id },
          data: { displayOrder: index },
        }),
      ),
    );

    return this.findAll(true);
  }

  /**
   * Delete category (hanya jika tidak ada artikel)
   */
  async delete(id: string) {
    const category = await this.findById(id);

    // Cek apakah ada artikel terkait
    if (category.articleCount > 0) {
      throw new BadRequestException(
        'Tidak dapat menghapus Panduan Layanan yang memiliki Informasi Layanan. Pindahkan atau hapus informasi layanan terlebih dahulu.',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Panduan Layanan berhasil dihapus' };
  }
}
