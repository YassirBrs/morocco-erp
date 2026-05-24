import { expect, type Page } from '@playwright/test';
import { BasePage } from './base-page';

const selectors = {
  tradeName: '#onboardingTradeName',
  ice: '#onboardingIce',
  ifNumber: '#onboardingIf',
  rc: '#onboardingRc',
  patente: '#onboardingPatente',
  cnssNumber: '#onboardingCnss',
  address: '#onboardingAddress',
  city: '#onboardingCity',
  invoiceSeries: '#onboardingInvoiceSeries',
  vatStatus: '#onboardingVatStatus',
  fiscalYearStartMonth: '#onboardingFiscalYearStart',
  submit: '#submitOnboarding',
  headerTradeName: '#tradeName',
  headerIdentity: '#identity',
  profileSeries: '#profileSeries',
};

export type MoroccanTenantIdentity = {
  tradeName: string;
  ice: string;
  ifNumber: string;
  rc: string;
  patente: string;
  cnssNumber: string;
  address: string;
  city: string;
  invoiceSeries: string;
  vatStatus: 'ENABLED' | 'EXEMPT';
  fiscalYearStartMonth: string;
};

export class TenantOnboardingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async completeWizard(identity: MoroccanTenantIdentity) {
    await this.fill(selectors.tradeName, identity.tradeName);
    await this.fill(selectors.ice, identity.ice);
    await this.fill(selectors.ifNumber, identity.ifNumber);
    await this.fill(selectors.rc, identity.rc);
    await this.fill(selectors.patente, identity.patente);
    await this.fill(selectors.cnssNumber, identity.cnssNumber);
    await this.fill(selectors.address, identity.address);
    await this.fill(selectors.city, identity.city);
    await this.fill(selectors.invoiceSeries, identity.invoiceSeries);
    await this.select(selectors.vatStatus, identity.vatStatus);
    await this.fill(selectors.fiscalYearStartMonth, identity.fiscalYearStartMonth);
    await this.click(selectors.submit);
    await this.waitForSuccessMessage(new RegExp(`Onboarding ${identity.tradeName} validé`));
    await expect(this.locator(selectors.headerTradeName)).toContainText(identity.tradeName);
    await expect(this.locator(selectors.headerIdentity)).toContainText(`ICE${identity.ice}`);
    await expect(this.locator(selectors.profileSeries)).toContainText(identity.invoiceSeries);
  }
}
