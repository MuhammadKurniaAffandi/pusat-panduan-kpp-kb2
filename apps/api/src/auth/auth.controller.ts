import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { UserFromJwt } from './interfaces';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login berhasil' })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token berhasil di-refresh' })
  @ApiResponse({ status: 401, description: 'Refresh token tidak valid' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout berhasil' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@CurrentUser('id') userId: string | null) {
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: UserFromJwt) {
    // ✅ FIX: Tidak perlu async jika tidak ada await
    return { user };
  }

  // ============================================
  // PASSWORD RESET ENDPOINTS
  // ============================================

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({
    status: 200,
    description: 'Email reset password berhasil dikirim (jika email terdaftar)',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // ✅ FIX: Pass DTO langsung, bukan hanya email
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Get('verify-reset-token/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify reset token validity' })
  @ApiResponse({
    status: 200,
    description: 'Token valid',
  })
  @ApiResponse({
    status: 400,
    description: 'Token tidak valid atau sudah kadaluarsa',
  })
  async verifyResetToken(@Param('token') token: string) {
    return this.authService.verifyResetToken(token);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password dengan token' })
  @ApiResponse({
    status: 200,
    description: 'Password berhasil direset',
  })
  @ApiResponse({
    status: 400,
    description: 'Token tidak valid atau sudah kadaluarsa',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // ✅ FIX: Pass DTO langsung
    return this.authService.resetPassword(resetPasswordDto);
  }
}
