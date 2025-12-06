// apps/api/src/auth/dto/forgot-password.dto.ts
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;
}
