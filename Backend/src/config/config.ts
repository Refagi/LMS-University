import { z } from 'zod';
import type{ TokenType } from '@/models/config.model';

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().trim().min(1, { message: 'DATABASE_URL is required' }),
  DATABASE_DIRECT_URL: z.string().trim().optional(),
  DATABASE_URL_TESTING: z.string().trim().optional(),
  JWT_SECRET: z.string().trim().min(1, { message: 'JWT_SECRET is required' }),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(30),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().default(30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce.number().default(5),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce.number().default(5),
});

class AppConfig {
  private typeEnv: z.infer<typeof envSchema>;
  private databaseUrl: string | null = null;

  constructor() {
    const parsedEnv = envSchema.safeParse(Bun.env);

    if (!parsedEnv.success) {
      console.error("Environment variables validation failed: ", z.treeifyError(parsedEnv.error));
      throw new Error("Invalid environment configuration");
    }

    this.typeEnv= parsedEnv.data;
    this.getDatabaseUrl();
 }

  private getDatabaseUrl(): void {
    if (this.typeEnv.NODE_ENV === "test") {
      if (!this.typeEnv.DATABASE_URL_TESTING) {
        throw new Error("DATABASE_URL_TESTING is required for testing");
      }
      const testUrl = this.typeEnv.DATABASE_URL_TESTING.replace(
        /\/postgres(\?|$)/, "/testingDb$1"
      );

      console.log("Using test database:", testUrl);
      this.databaseUrl = testUrl;
    }
    console.log(`Using ${this.typeEnv.NODE_ENV} database`);
    this.databaseUrl = this.typeEnv.DATABASE_URL;
  }

  get env(): string {
    return this.typeEnv.NODE_ENV;
  }

  get port(): number {
    return this.typeEnv.PORT;
  }

  get database(): string {
    if(!this.databaseUrl) {
      throw new Error("Database URL is not initilized");
    }
    return this.databaseUrl!;
  }

  get jwt(): TokenType{
    return {
      secret: this.typeEnv.JWT_SECRET,
      accessExpirationMinutes: this.typeEnv.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: this.typeEnv.JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinutes: this.typeEnv.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      verifyEmailExpirationMinutes: this.typeEnv.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
    }
  }
}

export const config = new AppConfig();
