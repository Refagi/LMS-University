import nodemailer, { type Transporter, type SendMailOptions } from 'nodemailer';
import { config } from '@/config/config.js';
import { logger } from '@/config/logger.js';

class EmailServices {
  private static transporter: Transporter = nodemailer.createTransport(
    config.email.smtp as SendMailOptions
  );

  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.info('Email service already initialized');
      return;
    }

    if (config.env === 'test') {
      logger.info('Email service skipped in test environment');
      return;
    }

    try {
      await this.transporter.verify();
      logger.info('Email server connected successfully');
      this.isInitialized = true;
    } catch (error: any) {
      logger.warn(`Unable to connect to email server: ${error.message}`);
      logger.warn('Check your SMTP configuration in .env file');
    }
  }

  private static async send(options: SendMailOptions): Promise<void> {
    try {
      const response = await this.transporter.sendMail(options);
      logger.info(`Email sent successfully: ${response.messageId}`);
    } catch (error: any) {
      logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
  
  static async sendVerificationEmail(email: string, token: string): Promise<void> {
    // const verificationUrl = `${config.fe}/verify-email?token=${token}`;
    const verificationUrl = `http://localhost:3000/v1/auth/verify-email?token=${token}`;
    const html = this.buildTemplate(verificationUrl);

    await this.send({
      from: config.email.from,
      to: email,
      subject: 'Verifikasi Email Anda - LMS University',
      html
    });
  }

    static async sendVerificationResetPassword(email: string, token: string): Promise<void> {
    const verificationUrl = `${config.fe}/reset-password?token=${token}`;
    const html = this.buildResetPasswordTemplate(verificationUrl);

    await this.send({
      from: config.email.from,
      to: email,
      subject: 'Reset Password - LMS University',
      html
    });
  }
  

  private static buildTemplate(verificationUrl: string): string {
    return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f4;">
    <table width="100%">
      <tr>
        <td align="center" style="padding:20px;">
          <table width="600" style="background:#ffffff;border-radius:8px;">
            <tr>
              <td style="padding:20px;text-align:center;font-family:Arial;">
                <h2 style="color:#272343;">LMS University</h2>
                <p>Silakan verifikasi email Anda untuk mengaktifkan akun Anda.</p>

                <a href="${verificationUrl}"
                  style="
                    display:inline-block;
                    padding:12px 24px;
                    background:#3a86ff; 
                    color:#fff;
                    text-decoration:none;
                    border-radius:5px;
                    font-weight:bold;
                  ">
                  Verify Email
                </a>

                <p style="font-size:12px;color:#999;margin-top:20px;">
                  Jika Anda tidak membuat akun ini, abaikan email ini.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;
  }

  private static buildResetPasswordTemplate(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f4;">
    <table width="100%">
      <tr>
        <td align="center" style="padding:20px;">
          <table width="600" style="background:#ffffff;border-radius:8px;">
            <tr>
              <td style="padding:30px;text-align:center;font-family:Arial, sans-serif;">
                
                <h2 style="color:#272343;margin-bottom:10px;">
                  LMS University
                </h2>

                <h3 style="color:#333;margin-bottom:20px;">
                  Reset Password Request
                </h3>

                <p style="color:#555;font-size:14px;line-height:1.6;">
                  Kami menerima permintaan untuk mengatur ulang password akun Anda.
                  Klik tombol di bawah ini untuk membuat password baru.
                </p>

                <a href="${resetUrl}"
                  style="
                    display:inline-block;
                    margin-top:20px;
                    padding:12px 24px;
                    background:#e63946;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:5px;
                    font-weight:bold;
                  ">
                  Reset Password
                </a>

                <p style="color:#555;font-size:13px;margin-top:25px;">
                  Link ini akan kedaluwarsa dalam <strong>15 menit</strong>.
                </p>

                <p style="color:#777;font-size:12px;margin-top:20px;">
                  Jika tombol tidak berfungsi, salin dan tempel URL berikut ke browser Anda:
                </p>

                <p style="word-break:break-all;color:#272343;font-size:12px;">
                  ${resetUrl}
                </p>

                <hr style="margin:30px 0;border:none;border-top:1px solid #eee;" />

                <p style="font-size:12px;color:#999;">
                  Jika Anda tidak meminta reset password, abaikan email ini.
                  Password Anda tidak akan berubah sampai Anda membuat yang baru.
                </p>

              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}


}

export default EmailServices;