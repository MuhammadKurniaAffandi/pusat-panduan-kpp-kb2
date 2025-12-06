// apps/api/src/auth/dto/reset-password.dto.ts
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'token-dari-email' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'passwordBaru123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  newPassword: string;
}
