'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel, formatMad } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialInvoices = [
  ['FAC-2026-0001', 'Atlas Retail', 'Comptabilisée', '14 400 MAD', '2 400 MAD'],
  ['FAC-2026-0002', 'Clinique Maarif', 'Brouillon', '8 900 MAD', '1 483 MAD'],
  ['NC-2026-0001', 'Tanger Logistics', 'Avoir', '-1 200 MAD', '-200 MAD'],
];

export function InvoiceManagementPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [customer, setCustomer] = useState('Rabat Services');
  const [amount, setAmount] = useState('12000');
  const [vatRate, setVatRate] = useState('20');
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    const numericVat = Number(vatRate);
    if (customer.trim().length < 3) {
      setToast({ tone: 'error', message: 'Client obligatoire avant émission de facture.' });
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setToast({ tone: 'error', message: 'Montant HT invalide: saisissez une base positive.' });
      return;
    }
    if (![0, 7, 10, 14, 20].includes(numericVat)) {
      setToast({ tone: 'error', message: 'Taux TVA non autorisé. Utilisez 0 %, 7 %, 10 %, 14 % ou 20 %.' });
      return;
    }
    const vat = numericAmount * (numericVat / 100);
    const total = numericAmount + vat;
    const number = `FAC-2026-${String(invoices.length + 1).padStart(4, '0')}`;
    setInvoices((current) => [[number, customer.trim(), 'Brouillon validé', formatMad(total), formatMad(vat)], ...current]);
    setToast({ tone: 'success', message: `${number} préparée avec TVA ${numericVat}% et série fiscale continue.` });
  };

  return (
    <WorkspaceLayout activeModule="Factures">
      <SectionHeader
        eyebrow="Ventes"
        title="Gestion des factures"
        description="Factures, avoirs, paiements et mentions légales marocaines dans un écran dédié."
        action={<StatusBadge tone="success">Série FAC-2026 active</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Nouvelle facture" description="Validation de client, montant et taux TVA marocain.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Client">
              <input value={customer} onChange={(event) => setCustomer(event.target.value)} />
            </FormField>
            <FormField label="Montant HT MAD">
              <input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </FormField>
            <FormField label="Taux TVA">
              <select value={vatRate} onChange={(event) => setVatRate(event.target.value)}>
                <option value="20">20 %</option>
                <option value="14">14 %</option>
                <option value="10">10 %</option>
                <option value="7">7 %</option>
                <option value="0">0 % exonéré</option>
              </select>
            </FormField>
            <button type="submit">Préparer facture</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Mentions facture" description="Contrôle lisible avant PDF et comptabilisation.">
          <div className="checkList">
            <span>ICE, IF, RC et Patente de l’émetteur</span>
            <span>Numéro séquentiel fiscal par exercice</span>
            <span>Base HT, taux TVA, montant TVA et total TTC</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Documents commerciaux">
        <DataTable columns={['Numéro', 'Client', 'Statut', 'TTC', 'TVA']} rows={invoices} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
