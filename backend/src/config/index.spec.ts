import { validateEnvironment } from './index';

describe('environment validation', () => {
  it('requires production database, auth, storage, origins, and public API settings', () => {
    expect(() => validateEnvironment({}, true)).toThrow('Configuration environnement incomplète');

    const config = validateEnvironment({
      PORT: '3100',
      DATABASE_URL: 'postgresql://morocco_erp:secret@localhost:5432/morocco_erp',
      JWT_SECRET: 'jwt-secret',
      AUTH_SECRET: 'auth-secret',
      STORAGE_PROVIDER: 'OBJECT_STORAGE_ADAPTER',
      ALLOWED_ORIGINS: 'https://app.example.ma,http://localhost:3001',
      NEXT_PUBLIC_API_URL: 'https://api.example.ma',
    }, true);

    expect(config.port).toBe(3100);
    expect(config.storageProvider).toBe('OBJECT_STORAGE_ADAPTER');
    expect(config.allowedOrigins).toEqual(['https://app.example.ma', 'http://localhost:3001']);
    expect(config.missing).toHaveLength(0);
  });
});
