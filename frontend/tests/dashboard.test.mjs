import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const staticPage = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const api = readFileSync(new URL('../lib/api.ts', import.meta.url), 'utf8');

test('dashboard renders Morocco ERP workspace sections', () => {
  for (const text of ['Ventes', 'Stock et CUMP', 'Comptabilite', 'Paie', 'Conformite Maroc']) {
    assert.ok(page.includes(text), `${text} section is present`);
  }
});

test('frontend is wired for tenant-scoped backend calls', () => {
  assert.ok(api.includes("'x-tenant-id': TENANT_ID"));
  assert.ok(api.includes('/tenant/current'));
  assert.ok(api.includes('/sales/invoices'));
  assert.ok(api.includes('/inventory'));
  assert.ok(staticPage.includes("'x-tenant-id': 'tenant-demo'"));
  assert.ok(staticPage.includes('/sales/invoices'));
});

test('layout uses dense ERP panels instead of a marketing hero', () => {
  assert.ok(css.includes('.shell'));
  assert.ok(css.includes('.gridTwo'));
  assert.ok(css.includes('grid-template-columns: 260px'));
});
