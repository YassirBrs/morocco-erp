export type RuntimeConfig = {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  authSecret: string;
  storageProvider: 'LOCAL_DEV' | 'OBJECT_STORAGE_ADAPTER';
  allowedOrigins: string[];
  publicApiUrl: string;
  missing: string[];
};

const requiredKeys = ['DATABASE_URL', 'JWT_SECRET', 'AUTH_SECRET', 'STORAGE_PROVIDER', 'ALLOWED_ORIGINS', 'NEXT_PUBLIC_API_URL'] as const;

export function validateEnvironment(env: Record<string, string | undefined>, strict = false): RuntimeConfig {
  const missing = requiredKeys.filter((key) => !env[key]);
  if (strict && missing.length) {
    throw new Error(`Configuration environnement incomplète: ${missing.join(', ')}`);
  }
  const storageProvider = env.STORAGE_PROVIDER === 'OBJECT_STORAGE_ADAPTER' ? 'OBJECT_STORAGE_ADAPTER' : 'LOCAL_DEV';
  return {
    port: parseInt(env.PORT ?? '3000', 10),
    databaseUrl: env.DATABASE_URL ?? '',
    jwtSecret: env.JWT_SECRET ?? '',
    authSecret: env.AUTH_SECRET ?? '',
    storageProvider,
    allowedOrigins: (env.ALLOWED_ORIGINS ?? 'http://localhost:3001').split(',').map((origin) => origin.trim()).filter(Boolean),
    publicApiUrl: env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100',
    missing,
  };
}

export const CONFIG = validateEnvironment(process.env, process.env.NODE_ENV === 'production');
