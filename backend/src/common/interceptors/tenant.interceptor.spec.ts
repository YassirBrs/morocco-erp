import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { TenantInterceptor } from './tenant.interceptor';
import { ClsService } from 'nestjs-cls';

// ─────────────────────────────────────────────────────────────────────────────
//  FIXTURES
// ─────────────────────────────────────────────────────────────────────────────
class MockCallHandler {
  handle(): Observable<unknown> { return of('response'); }
}

type MockCls = {
  store: Map<string, any>;
  set: jest.Mock;
  get: jest.Mock;
  exit: jest.Mock;
};

const buildMockCls = (): MockCls => {
  const store = new Map<string, any>();
  return {
    store,
    set:  jest.fn().mockImplementation((k: string, v: any) => { store.set(k, v); }),
    get:  jest.fn().mockImplementation((k: string)               => store.get(k)        ),
    exit: jest.fn().mockImplementation(()                         => store.clear()),
  };
};

const makeCtx = (headers: Record<string, any>) =>
  ({ switchToHttp: () => ({ getRequest: () => ({ headers }) }) }) as any;

// ─────────────────────────────────────────────────────────────────────────────
//  SPEC
// ─────────────────────────────────────────────────────────────────────────────
describe('TenantInterceptor', () => {
  let interceptor: TenantInterceptor;
  let mockCls: MockCls;

  beforeEach(async () => {
    mockCls = buildMockCls();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantInterceptor,
        { provide: ClsService, useValue: mockCls },
      ],
    }).compile();
    interceptor = module.get<TenantInterceptor>(TenantInterceptor);
  });

  afterEach(() => jest.clearAllMocks());

  describe('happy path', () => {
    it('reads X-Tenant-ID and binds it into CLS', (done) => {
      interceptor
        .intercept(makeCtx({ 'x-tenant-id': 'tenant-42' }), new MockCallHandler())
        .subscribe({
          next()  { expect(mockCls.set).toHaveBeenCalledWith('tenantId', 'tenant-42'); done(); },
          error:  done.fail,
        });
    });

    it('forwards the downstream response unchanged', (done) => {
      interceptor
        .intercept(makeCtx({ 'x-tenant-id': 'T1' }), new MockCallHandler())
        .subscribe({
          next(v) { expect(v).toBe('response'); done(); },
          error:  done.fail,
        });
    });

    it('calls cls.exit on completion', (done) => {
      interceptor
        .intercept(makeCtx({ 'x-tenant-id': 'T1' }), new MockCallHandler())
        .subscribe({
          error: done.fail,
          complete() {
            setImmediate(() => {
              expect(mockCls.exit).toHaveBeenCalled();
              done();
            });
          },
        });
    });
  });

  describe('missing X-Tenant-ID', () => {
    it('throws BadRequestException synchronously', () => {
      expect(() =>
        interceptor.intercept(makeCtx({}), new MockCallHandler()),
      ).toThrow(BadRequestException);
    });

    it('throws the expected message', () => {
      expect(() =>
        interceptor.intercept(makeCtx({}), new MockCallHandler()),
      ).toThrow('X-Tenant-ID header is required');
    });

    it('never calls cls.set when header is absent', () => {
      try { interceptor.intercept(makeCtx({}), new MockCallHandler()); } catch { /* swallow */ }
      expect(mockCls.set).not.toHaveBeenCalled();
    });
  });
});
