'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel, formatMad } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialTickets = [
  ['TCK-2026-1201', 'Casa Maarif', 'Carte', '3 000 MAD', 'Stock synchronisé'],
  ['TCK-2026-1200', 'Casa Maarif', 'Espèces', '740 MAD', 'Journal caisse prêt'],
  ['TCK-2026-1199', 'Rabat Agdal', 'Offline', '1 120 MAD', 'Conflit à revoir'],
];

export function PosRegisterPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [product, setProduct] = useState('SKU-CHAIR');
  const [amount, setAmount] = useState('2500');
  const [payment, setPayment] = useState('Carte');
  const [toast, setToast] = useState<ToastState>(null);

  const totalDay = useMemo(() => tickets.length * 7400, [tickets.length]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amountValue = Number(amount);
    if (!sessionOpen) {
      setToast({ tone: 'error', message: 'Ouvrez une session caisse avant encaissement.' });
      return;
    }
    if (product.trim().length < 3) {
      setToast({ tone: 'error', message: 'Article POS obligatoire pour synchroniser le stock.' });
      return;
    }
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setToast({ tone: 'error', message: 'Montant ticket invalide.' });
      return;
    }
    const number = `TCK-2026-${1201 + tickets.length}`;
    setTickets((current) => [[number, 'Casa Maarif', payment, formatMad(amountValue), 'Stock synchronisé'], ...current]);
    setToast({ tone: 'success', message: `${number} encaissé, stock réservé et Z report mis à jour.` });
  };

  return (
    <WorkspaceLayout activeModule="POS">
      <SectionHeader
        eyebrow="Point de vente"
        title="Caisse, tickets et Z report"
        description="Session caisse tactile, paiements, remboursements, queue offline et synchronisation stock."
        action={<StatusBadge tone={sessionOpen ? 'success' : 'warning'}>{sessionOpen ? 'Session ouverte' : 'Session fermée'}</StatusBadge>}
      />
      <div className="kpiStrip">
        <span><strong>{formatMad(totalDay)}</strong><small>Ventes jour TTC</small></span>
        <span><strong>4 tickets</strong><small>Offline queue</small></span>
        <span><strong>-130 MAD</strong><small>Écart caisse à justifier</small></span>
      </div>
      <div className="workspaceGrid two">
        <WorkspacePanel title="Encaissement" description="Aucun ticket sans session POS active.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <button type="button" className="uxSecondaryButton" onClick={() => { setSessionOpen(true); setToast({ tone: 'info', message: 'Session caisse POS-CASA-02 ouverte.' }); }}>Ouvrir session</button>
            <FormField label="Article ou code-barres"><input value={product} onChange={(event) => setProduct(event.target.value)} /></FormField>
            <FormField label="Montant TTC MAD"><input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></FormField>
            <FormField label="Paiement"><select value={payment} onChange={(event) => setPayment(event.target.value)}><option>Carte</option><option>Espèces</option><option>Virement</option></select></FormField>
            <button type="submit">Encaisser ticket</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Z report" description="Résumé prêt pour Journal Comptable caisse.">
          <div className="checkList">
            <span>Espèces, carte et remboursements ventilés</span>
            <span>TVA et total TTC conservés sur reçu</span>
            <span>Signature superviseur requise si écart caisse</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Tickets récents">
        <DataTable columns={['Ticket', 'Magasin', 'Paiement', 'Total', 'Statut']} rows={tickets} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
