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
  
  static async sendVerification(email: string, token: string): Promise<void> {
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
                    background:#272343;
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
}

export default EmailServices;