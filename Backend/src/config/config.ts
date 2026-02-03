import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().trim().min(1, { message: 'DATABASE_URL is required' }),
  DATABASE_DIRECT_URL: z.string().trim().optional(),
  DATABASE_URL_TESTING: z.string().trim().optional(),
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
}

export const config = new AppConfig();
