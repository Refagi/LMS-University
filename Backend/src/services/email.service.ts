import nodemailer, { type Transporter, type SendMailOptions } from 'nodemailer';
import { config } from '@/config/config.js';
import { logger } from '@/config/logger.js';

export class EmailServices {
  private static transporter: Transporter;

  constructor() {
    EmailServices.transporter = nodemailer.createTransport( config.email.smtp as SendMailOptions);

    this.verifyConnection();
  }

  private verifyConnection(): void {
    if (config.env === 'test') return;

    EmailServices.transporter
      .verify()
      .then(() => logger.info('Email server connected'))
      .catch(() =>
        logger.warn(
          'Unable to connect to email server. Check SMTP configuration'
        )
      );
  }

  protected static async send(options: SendMailOptions): Promise<void> {
    const response = await this.transporter.sendMail(options);
    logger.info(`Email sent: ${response.messageId}`);
  }
  
  static async sendVerification(email: string, token: string): Promise<void> {
    const verificationUrl = `${config.fe}/verify-email?token=${token}`;

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
                <h2 style="color:#272343;">Calculator Food Nutritions</h2>
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