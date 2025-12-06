import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';
import { JwtPayload } from './interfaces';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akun tidak aktif');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    const tokenHash = this.hashToken(refreshToken);

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    if (!storedToken.user.isActive) {
      throw new UnauthorizedException('Akun tidak aktif');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const tokens = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
    );

    await this.saveRefreshToken(storedToken.user.id, tokens.refreshToken);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = storedToken.user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    return { message: 'Logout berhasil' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // ============================================
  // PASSWORD RESET METHODS
  // ============================================

  /**
   * ✅ FIX: Menggunakan DTO sebagai parameter
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // ✅ Best Practice Keamanan: Jangan beri tahu apakah email ada atau tidak
      // untuk menghindari enumerasi user
      return {
        message:
          'Jika email terdaftar, tautan reset password telah dikirim ke email Anda.',
      };
    }

    // 1. Generate Token Reset (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash Token untuk disimpan di database
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3. Set Expiry Time (1 jam dari sekarang)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 4. Simpan Token Hash dan Expiry ke Database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetTokenHash,
        passwordResetExpiresAt: expiresAt,
      },
    });

    // 5. Kirim Email dengan Token Asli (BUKAN hash)
    await this.mailService.sendPasswordReset(
      user.email,
      user.fullName,
      resetToken,
    );

    return {
      message:
        'Jika email terdaftar, tautan reset password telah dikirim ke email Anda.',
    };
  }

  /**
   * ✅ NEW: Verify Reset Token
   * Untuk validasi token sebelum user input password baru
   */
  async verifyResetToken(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpiresAt: {
          gt: new Date(), // Token belum kadaluarsa
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Token reset password tidak valid atau sudah kadaluarsa.',
      );
    }

    return {
      valid: true,
      email: user.email,
      message: 'Token valid. Silakan masukkan password baru Anda.',
    };
  }

  /**
   * ✅ FIX: Menggunakan DTO sebagai parameter
   * Reset Password menggunakan token
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    // 1. Hash Token dari User
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Cari User dengan Token Hash yang Valid dan Belum Kadaluarsa
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpiresAt: {
          gt: new Date(), // Pastikan belum kadaluarsa
        },
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Token reset password tidak valid atau sudah kadaluarsa.',
      );
    }

    // 3. Hash Password Baru
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // 4. Update Password dan Bersihkan Token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        passwordResetToken: null, // Hapus token
        passwordResetExpiresAt: null, // Hapus expiry
      },
    });

    // 5. Revoke semua refresh token untuk paksa logout dari semua device
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, isRevoked: false },
      data: { isRevoked: true },
    });

    return {
      message:
        'Password berhasil direset. Silakan login dengan password baru Anda.',
    };
  }
}
