import { z } from 'zod';


const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().trim().min(1, { message: 'DATABASE_URL is required' }),
  DIRECT_URL: z.string().trim().optional(),
  DATABASE_URL_TESTING: z.string().trim().optional(),
});

const parsedEnv = envSchema.safeParse(Bun.env);

if (!parsedEnv.success) {
  console.error("Environment variables validation failed: ", z.treeifyError(parsedEnv.error));
  throw new Error("Invalid environment configuration");
}

const env = parsedEnv.data;

const getDatabaseUrl = () => {
  if (env.NODE_ENV === "test") {
    if (!env.DATABASE_URL_TESTING) {
      throw new Error("DATABASE_URL_TESTING is required for testing");
    }

    const testUrl = env.DATABASE_URL_TESTING.replace(
      /\/postgres(\?|$)/,
      "/testingDb$1"
    );

    console.log("Using test database:", testUrl);
    return testUrl;
  }

  console.log(`Using ${env.NODE_ENV} database`);
  return env.DATABASE_URL;
};

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,

  database: {
    url: getDatabaseUrl(),
  },
};
