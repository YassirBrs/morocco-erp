import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ErpStoreService } from '../erp/erp-store.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService, private readonly store: ErpStoreService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] as string | undefined;
    const userRole = request.headers['x-user-role'] as string | undefined;
    const userEmail = request.headers['x-user-email'] as string | undefined;
    const path = request.path ?? request.url ?? '';

    if (!tenantId && (path.startsWith('/auth') || path === '/health')) {
      return next.handle();
    }

    if (!tenantId) {
      throw new BadRequestException('X-Tenant-ID header is required');
    }

    this.cls.set('tenantId', tenantId);
    this.cls.set('userRole', userRole ?? 'OWNER');
    this.cls.set('userEmail', userEmail ?? 'owner@atlas.ma');
    this.store.assertHttpWriteAllowed(tenantId, request.method ?? 'GET', path, userRole);

    return next.handle().pipe(
      finalize(() => this.cls.exit(() => {})),
    );
  }
}
