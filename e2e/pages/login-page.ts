import { expect, type Page } from '@playwright/test';
import { BasePage } from './base-page';

const selectors = {
  tradeName: '#tradeName',
  identity: '#identity',
};

type LoginResponse = {
  status: string;
  access_token: string;
  tenantId: string;
  user: { email: string; tenant: { id: string } };
};

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async resetDemoData() {
    const reset = await this.apiPost<{ status: string; summary: { tenant: { id: string } } }>('/tenant/demo-reset', {
      environment: 'test',
    });
    expect(reset.status).toBe('RESET');
    expect(reset.summary.tenant.id).toBe('tenant-demo');
  }

  async open() {
    await this.page.goto('/index.html');
    await this.page.waitForSelector(selectors.tradeName);
    await expect(this.locator(selectors.tradeName)).not.toContainText('Chargement');
  }

  async signInAsTenantOwner() {
    const login = await this.apiPost<LoginResponse>('/auth/login', {
      email: 'owner@atlas.ma',
      password: 'demo1234',
      ip: '41.248.10.10',
      userAgent: 'Morocco ERP E2E',
    });
    expect(login.status).toBe('AUTHENTICATED');
    expect(login.access_token).toBeTruthy();
    expect(login.tenantId).toBe('tenant-demo');
    expect(login.user.tenant.id).toBe('tenant-demo');
    await expect(this.locator(selectors.identity)).toContainText('ICE');
  }
}
