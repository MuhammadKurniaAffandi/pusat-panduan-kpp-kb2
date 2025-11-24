import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get semua users dengan pagination
   */
  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { fullName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          avatarUrl: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return user;
  }

  /**
   * Create user baru
   */
  async create(createUserDto: CreateUserDto) {
    const { email, password, fullName, role, avatarUrl } = createUserDto;

    // Cek email sudah digunakan atau belum
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah digunakan');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
        avatarUrl,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Update user
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Cek user exists
    await this.findById(id);

    const { password, ...rest } = updateUserDto;

    // Prepare update data
    const updateData: any = { ...rest };

    // Hash password jika diupdate
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }

    // Cek email conflict jika diupdate
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new ConflictException('Email sudah digunakan');
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Delete user (soft delete dengan set isActive = false)
   */
  async delete(id: string) {
    await this.findById(id);

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'User berhasil dihapus' };
  }

  /**
   * Hard delete user (permanent)
   */
  async hardDelete(id: string) {
    await this.findById(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User berhasil dihapus permanen' };
  }
}
