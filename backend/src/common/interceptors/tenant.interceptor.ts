import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] as string | undefined;
    const path = request.path ?? request.url ?? '';

    if (!tenantId && (path.startsWith('/auth') || path === '/health')) {
      return next.handle();
    }

    if (!tenantId) {
      throw new BadRequestException('X-Tenant-ID header is required');
    }

    this.cls.set('tenantId', tenantId);

    return next.handle().pipe(
      finalize(() => this.cls.exit(() => {})),
    );
  }
}
