import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class AuthService {
  constructor(private readonly store: ErpStoreService) {}

  validateUser(email: string, password: string) {
    return this.store.authenticate(email, password);
  }

  login(user: { email: string; password: string; twoFactorCode?: string; ip?: string; userAgent?: string }) {
    return this.store.login(user);
  }

  refresh(refreshToken: string) { return this.store.refreshSession(refreshToken); }
  requestPasswordReset(email: string) { return this.store.requestPasswordReset(email); }
  resetPassword(data: { token: string; password: string }) { return this.store.resetPassword(data); }
  enableTwoFactor(userId: string) { return this.store.enableTwoFactor(userId); }
  verifyTwoFactor(userId: string, code: string) { return this.store.verifyTwoFactor(userId, code); }
  deviceHistory() { return this.store.deviceHistory(); }
}
