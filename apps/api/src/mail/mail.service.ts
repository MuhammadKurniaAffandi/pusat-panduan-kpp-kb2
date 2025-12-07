import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private fromEmail: string;
  private frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.initializeNodemailer();
  }

  /**
   * Initialize Nodemailer SMTP Transport
   */
  private initializeNodemailer(): void {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT') || 587;
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      throw new Error(
        'SMTP configuration incomplete. Required: SMTP_HOST, SMTP_USER, SMTP_PASS',
      );
    }

    // Create SMTP Transport
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user,
        pass,
      },
      // Optional: untuk debugging
      logger: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development',
    } as SMTPTransport.Options);

    this.fromEmail =
      this.configService.get<string>('MAIL_FROM') ||
      `"KPP Help Center" <${user}>`;

    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    this.logger.log('✅ Nodemailer (SMTP) Mail Service initialized');
    this.logger.log(`📧 From: ${this.fromEmail}`);
    this.logger.log(`🌐 Frontend URL: ${this.frontendUrl}`);
  }

  /**
   * Verify SMTP Connection (Optional - untuk testing)
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('✅ SMTP connection verified');
      return true;
    } catch (error) {
      this.logger.error('❌ SMTP connection failed', error);
      return false;
    }
  }

  /**
   * Send Password Reset Email
   */
  async sendPasswordReset(
    toEmail: string,
    userName: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${resetToken}`;

    try {
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to: toEmail,
        subject: 'Reset Password - KPP Pratama Jakarta Kebayoran Baru Dua',
        html: this.getPasswordResetTemplate(userName, resetUrl),
      });

      this.logger.log(
        `✅ Password reset email sent to ${toEmail} (Message ID: ${info.messageId})`,
      );

      // Log preview URL untuk development (Ethereal Email)
      if (process.env.NODE_ENV === 'development' && info.response) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          this.logger.log(`📧 Preview URL: ${previewUrl}`);
        }
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to send password reset email to ${toEmail}`,
        error,
      );
      throw new Error(
        `Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * HTML Email Template untuk Reset Password
   */
  private getPasswordResetTemplate(userName: string, resetUrl: string): string {
    const currentYear = new Date().getFullYear();
    return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #003366; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">KPP Pratama Jakarta Kebayoran Baru Dua</h1>
              <p style="margin: 10px 0 0; color: #e6ebf0; font-size: 14px;">Pusat Bantuan</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 20px;">Halo, ${userName}</h2>
              
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah ini untuk membuat password baru:
              </p>

              <!-- Reset Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 14px 40px; background-color: #003366; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Atau copy dan paste link berikut ke browser Anda:
              </p>
              
              <p style="margin: 0 0 20px; padding: 12px; background-color: #f5f7fa; border-radius: 4px; word-break: break-all; font-size: 13px; color: #0052a3;">
                ${resetUrl}
              </p>

              <!-- Warning -->
              <div style="margin: 30px 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Penting:</strong><br>
                  Link ini akan kadaluarsa dalam <strong>1 jam</strong>.<br>
                  Jika Anda tidak meminta reset password, abaikan email ini.
                </p>
              </div>

              <p style="margin: 20px 0 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">
                Jika tombol tidak berfungsi, copy dan paste link di atas ke browser Anda.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f5f7fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; text-align: center;">
                Email ini dikirim oleh sistem secara otomatis.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © ${currentYear} KPP Pratama Jakarta Kebayoran Baru Dua<br>
                Jl. KH. Ahmad Dahlan Kby. No.14A, RT.2/RW.1, Kramat Pela, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12130
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Send Welcome Email (Optional - untuk user baru)
   */
  async sendWelcomeEmail(toEmail: string, userName: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to: toEmail,
        subject: 'Selamat Datang - KPP Pratama Jakarta Kebayoran Baru Dua',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #003366;">Selamat Datang, ${userName}!</h1>
            <p style="font-size: 16px; color: #333;">
              Akun Anda telah berhasil dibuat di Pusat Bantuan KPP Pratama Jakarta Kebayoran Baru Dua.
            </p>
            <p style="font-size: 16px; color: #333;">
              Anda sekarang dapat login dan mengakses berbagai panduan dan artikel bantuan.
            </p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af;">
              © 2024 KPP Pratama Jakarta Kebayoran Baru Dua
            </p>
          </div>
        `,
      });

      this.logger.log(
        `✅ Welcome email sent to ${toEmail} (Message ID: ${info.messageId})`,
      );
    } catch (error) {
      this.logger.error('❌ Failed to send welcome email', error);
      throw new Error(
        `Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Send Password Changed Notification (Security)
   */
  async sendPasswordChangedNotification(
    toEmail: string,
    userName: string,
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to: toEmail,
        subject: 'Password Anda Telah Diubah - KPP Pratama Jakarta KB2',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #003366;">Password Berhasil Diubah</h1>
            <p style="font-size: 16px; color: #333;">Halo ${userName},</p>
            <p style="font-size: 16px; color: #333;">
              Password akun Anda telah berhasil diubah pada ${new Date().toLocaleString('id-ID')}.
            </p>
            <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⚠️ Jika Anda tidak melakukan perubahan ini, segera hubungi administrator.</strong>
              </p>
            </div>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af;">
              © 2024 KPP Pratama Jakarta Kebayoran Baru Dua
            </p>
          </div>
        `,
      });

      this.logger.log(
        `✅ Password changed notification sent to ${toEmail} (Message ID: ${info.messageId})`,
      );
    } catch (error) {
      this.logger.error(
        '❌ Failed to send password changed notification',
        error,
      );
      // Don't throw - ini optional notification
    }
  }
}
