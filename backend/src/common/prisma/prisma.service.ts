import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { ClsService } from 'nestjs-cls';

// ─────────────────────────────────────────────────────────────────────────────
//  CLS singleton
// ─────────────────────────────────────────────────────────────────────────────
let __cls: ClsService;

/** Throw 400 if no tenantId is bound — block before any DB call. */
function requireTenantId(): string {
  const id = __cls.get<string>('tenantId');
  if (!id) {
    throw new BadRequestException(
      'Tenant context is required – ensure the X-Tenant-ID header is present.',
    );
  }
  return id;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Argument adapters
// ─────────────────────────────────────────────────────────────────────────────
const addWhere = (args: any, tenantId: string): any =>
  args
    ? { ...args, where: { ...(args.where ?? {}), tenantId } }
    : { where: { tenantId } };

const addCreateData = (args: any, tenantId: string): any => {
  const base = args?.data ?? {};
  return { ...args, data: { ...(base ?? {}), tenantId } };
};

/**
 * Tenant-filtering Prisma extension applied ONCE in onModuleInit.
 *
 *  Reads / aggregates  → tenantId merged into `where`
 *  create / createMany → tenantId merged into `data`
 *  update / delete     → tenantId merged into `where`
 *
 * `$allOperations` dispatches by `operation.type` and forwards to
 * `query(amendedArgs)`, which is Prisma's canonical extension forwarding mechanism.
 */
const tenantExtension = Prisma.defineExtension({
  name: 'tenantFilter',
  query: {
    $allModels: {
      async $allOperations(params: { model: string; operation: string; args: any; query: (a: any) => Promise<any> }) {
        const { operation, args, query } = params;
        const t = requireTenantId();
        switch (operation) {
          // ── reads ────────────────────────────────────────────────────────────
          case 'findFirst':
          case 'findMany':
          case 'findUnique':
          case 'findUniqueOrThrow':
          case 'findFirstOrThrow':
          case 'count':
          case 'aggregate':
          case 'groupBy':
            return query(addWhere(args, t));

          // ── writes: tenantId via `data` ──────────────────────────────────────
          case 'create':
          case 'createMany':
            return query(addCreateData(args, t));

          // ── writes / deletes: tenantId via `where` ───────────────────────────
          case 'update':
          case 'updateMany':
          case 'upsert':
          case 'delete':
          case 'deleteMany':
            return query(addWhere(args, t));

          // ── safety fallback ──────────────────────────────────────────────────
          default:
            return query(addWhere(args, t));
        }
      },
    },
  },
}) as any;   // $allModels needs `any` — Prisma type is fully union-typed

/**
 * Multi-tenant NestJS Prisma service.
 *
 *  onModuleInit  → connects to Postgres then attaches tenantExtension.
 *  Every subsequent query is transparently scoped to the active tenant.
 *  Missing tenantId in CLS throws BadRequestException(400) before any SQLExecution.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly cls: ClsService) {
    super({
      log: ['query', 'error', 'warn'],
    });
    // Store CLS at module scope so that `$extends()` callbacks reach it
    // regardless of `this` context rebinding inside the closure.
    __cls = this.cls;
  }

  async onModuleInit(): Promise<void> {
    if (!process.env.DATABASE_URL) {
      return;
    }
    await this.$connect();
    this.$extends(tenantExtension);
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  enableShutdownHooks(app: any): void {
    app.enableShutdownHooks();
  }
}
