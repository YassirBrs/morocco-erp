import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class AuthService {
  constructor(private readonly store: ErpStoreService) {}

  validateUser(email: string, password: string) {
    return this.store.authenticate(email, password);
  }

  login(user: { email: string; password: string }) {
    const principal = this.validateUser(user.email, user.password);
    return {
      access_token: `demo-token-${principal.tenantId}-${principal.id}`,
      token_type: 'Bearer',
      user: principal,
      tenantId: principal.tenantId,
    };
  }
}
