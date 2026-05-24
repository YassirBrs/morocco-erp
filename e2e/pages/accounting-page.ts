import { expect, type Page } from '@playwright/test';
import { BasePage } from './base-page';
import type { Invoice } from './crm-sales-page';

type JournalEntry = {
  id: string;
  source: string;
  description: string;
  status: string;
  lines: Array<{ account: string; debit: number; credit: number }>;
};

export class AccountingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectCompliantPostedInvoice(invoice: Invoice, invoiceSeries: string) {
    expect(invoice.number).toMatch(new RegExp(`^${invoiceSeries}-2026-\\d{5}$`));
    expect(invoice.totals.vatByRate['20%']).toBeGreaterThan(0);
    expect(invoice.lines.every((line) => line.vatRate === 0.2)).toBeTruthy();

    const journalEntries = await this.apiGet<JournalEntry[]>('/ledger/journal');
    const invoiceJournal = journalEntries.find((entry) => entry.source === invoice.number);
    expect(invoiceJournal).toBeTruthy();
    expect(invoiceJournal!.status).toBe('POSTED');
    expect(invoiceJournal!.lines.map((line) => line.account)).toEqual(expect.arrayContaining(['3421', '7111', '4455']));
    const debit = invoiceJournal!.lines.reduce((sum, line) => sum + line.debit, 0);
    const credit = invoiceJournal!.lines.reduce((sum, line) => sum + line.credit, 0);
    expect(Number(debit.toFixed(2))).toBe(Number(credit.toFixed(2)));
    expect(Number(debit.toFixed(2))).toBe(invoice.totals.total);

    const vatReport = await this.apiGet<{ byRate: Array<{ rate: string; collected: number; net: number }> }>('/ledger/vat-report');
    expect(vatReport.byRate.some((row) => row.rate === '20%' && row.collected >= invoice.totals.vatTotal && row.net >= invoice.totals.vatTotal)).toBeTruthy();
  }

  async expectPartialPaymentAccounting(invoice: Invoice) {
    const journalEntries = await this.apiGet<JournalEntry[]>('/ledger/journal');
    const paymentJournal = journalEntries.find((entry) => entry.description.includes(`Paiement ${invoice.number}`));
    expect(paymentJournal).toBeTruthy();
    expect(paymentJournal!.lines.map((line) => line.account)).toEqual(expect.arrayContaining(['5141', '3421']));
    const debit = paymentJournal!.lines.reduce((sum, line) => sum + line.debit, 0);
    const credit = paymentJournal!.lines.reduce((sum, line) => sum + line.credit, 0);
    expect(Number(debit.toFixed(2))).toBe(Number(credit.toFixed(2)));

    const audit = await this.apiGet<Array<{ action: string; entity: string; entityId: string }>>('/ledger/audit');
    expect(audit.some((entry) => entry.action === 'payment.recorded' && entry.entity === 'Payment')).toBeTruthy();
  }
}
