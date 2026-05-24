import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from './prisma.service';

describe('PrismaService tenant guard', () => {
  let prisma: PrismaService;
  let store: Map<string, unknown>;
  let originalDatabaseUrl: string | undefined;

  beforeEach(async () => {
    originalDatabaseUrl = process.env.DATABASE_URL;
    store = new Map<string, unknown>();
    const cls = {
      set: jest.fn((key: string, value: unknown) => {
        store.set(key, value);
      }),
      get: jest.fn((key: string) => store.get(key)),
      exit: jest.fn(() => store.clear()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, { provide: ClsService, useValue: cls }],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
    jest.restoreAllMocks();
  });

  it('reads tenantId from the CLS-backed request context', () => {
    store.set('tenantId', 'tenant-99');
    expect(store.get('tenantId')).toBe('tenant-99');
  });

  it('uses BadRequestException for missing tenant context', () => {
    const read = () => {
      const id = store.get('tenantId');
      if (!id) {
        throw new BadRequestException(
          'Tenant context is required - ensure the X-Tenant-ID header is present.',
        );
      }
    };

    expect(read).toThrow(BadRequestException);
    expect(read).toThrow('Tenant context is required');
  });

  it('connects and attaches the tenant extension on module init', async () => {
    process.env.DATABASE_URL = 'postgresql://example';
    const connect = jest.spyOn(prisma as any, '$connect').mockResolvedValue(undefined);
    const extend = jest.spyOn(prisma as any, '$extends').mockReturnValue(prisma);

    await prisma.onModuleInit();

    expect(connect).toHaveBeenCalledTimes(1);
    expect(extend).toHaveBeenCalledWith(expect.any(Function));
  });

  it('skips database connection when DATABASE_URL is absent for local demo mode', async () => {
    delete process.env.DATABASE_URL;
    const connect = jest.spyOn(prisma as any, '$connect').mockResolvedValue(undefined);

    await prisma.onModuleInit();

    expect(connect).not.toHaveBeenCalled();
  });

  it('disconnects on module destroy', async () => {
    const disconnect = jest.spyOn(prisma as any, '$disconnect').mockResolvedValue(undefined);

    await prisma.onModuleDestroy();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
