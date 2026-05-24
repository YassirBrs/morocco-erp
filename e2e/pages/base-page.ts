import { expect, type APIRequestContext, type Page } from '@playwright/test';

export const apiBaseUrl = process.env.E2E_API_URL ?? 'http://127.0.0.1:3100';
export const tenantHeaders = {
  'content-type': 'application/json',
  'x-tenant-id': process.env.E2E_TENANT_ID ?? 'tenant-demo',
};

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected locator(selector: string) {
    return this.page.locator(selector);
  }

  protected async click(selector: string) {
    await expect(this.locator(selector)).toBeVisible();
    await this.locator(selector).click();
  }

  protected async fill(selector: string, value: string) {
    await expect(this.locator(selector)).toBeVisible();
    await this.locator(selector).fill(value);
  }

  protected async select(selector: string, value: string) {
    await expect(this.locator(selector)).toBeVisible();
    await this.locator(selector).selectOption(value);
  }

  protected async waitForSuccessMessage(text: string | RegExp) {
    await this.page.waitForSelector('#message:not([hidden])');
    await expect(this.locator('#message')).toContainText(text);
  }

  protected async apiGet<T>(path: string): Promise<T> {
    return apiGet<T>(this.page.request, path);
  }

  protected async apiPost<T>(path: string, data: unknown): Promise<T> {
    return apiPost<T>(this.page.request, path, data);
  }
}

export async function apiGet<T>(request: APIRequestContext, path: string): Promise<T> {
  const response = await request.get(`${apiBaseUrl}${path}`, { headers: tenantHeaders });
  expect(response.ok(), `${path} returned ${response.status()}: ${await response.text()}`).toBeTruthy();
  return response.json() as Promise<T>;
}

export async function apiPost<T>(request: APIRequestContext, path: string, data: unknown): Promise<T> {
  const response = await request.post(`${apiBaseUrl}${path}`, { headers: tenantHeaders, data });
  expect(response.ok(), `${path} returned ${response.status()}: ${await response.text()}`).toBeTruthy();
  return response.json() as Promise<T>;
}

export function latest<T>(items: T[]): T {
  expect(items.length).toBeGreaterThan(0);
  return items[items.length - 1];
}
