'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel, formatMad } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialJournals = [
  ['JV-2026-051', 'Ventes', 'FAC-2026-0001', '14 400 MAD', '14 400 MAD', 'Comptabilisée'],
  ['BQ-2026-044', 'Banque', 'REG-2026-019', '8 900 MAD', '8 900 MAD', 'Lettrage proposé'],
  ['OD-2026-008', 'Opérations diverses', 'Provision stock', '14 200 MAD', '14 200 MAD', 'Pièce attendue'],
];

export function AccountingWorkspacePage() {
  const [journals, setJournals] = useState(initialJournals);
  const [label, setLabel] = useState('Provision facture fournisseur');
  const [debit, setDebit] = useState('4200');
  const [credit, setCredit] = useState('4200');
  const [periodLocked, setPeriodLocked] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const debitValue = Number(debit);
    const creditValue = Number(credit);
    if (label.trim().length < 5) {
      setToast({ tone: 'error', message: 'Libellé Journal Comptable trop court pour audit.' });
      return;
    }
    if (periodLocked) {
      setToast({ tone: 'error', message: 'Clôture de période active: écriture rejetée.' });
      return;
    }
    if (!Number.isFinite(debitValue) || !Number.isFinite(creditValue) || debitValue <= 0 || creditValue <= 0) {
      setToast({ tone: 'error', message: 'Débit et crédit doivent être des montants positifs.' });
      return;
    }
    if (debitValue !== creditValue) {
      setToast({ tone: 'error', message: 'Écriture déséquilibrée: débit et crédit doivent être identiques.' });
      return;
    }
    const number = `OD-2026-${String(journals.length + 9).padStart(3, '0')}`;
    setJournals((current) => [[number, 'Journal Comptable', label.trim(), formatMad(debitValue), formatMad(creditValue), 'Brouillon équilibré'], ...current]);
    setToast({ tone: 'success', message: `${number} créée et prête pour revue comptable.` });
  };

  return (
    <WorkspaceLayout activeModule="Comptabilité">
      <SectionHeader
        eyebrow="Comptabilité Maroc"
        title="PCGE, Journal Comptable et Clôture de période"
        description="Saisie équilibrée, contrôle TVA, rapprochement bancaire et preuves auditables pour l’expert-comptable."
        action={<StatusBadge tone={periodLocked ? 'danger' : 'success'}>{periodLocked ? 'Période verrouillée' : 'Période 05/2026 ouverte'}</StatusBadge>}
      />
      <div className="kpiStrip">
        <span><strong>Balance</strong><small>Débit = Crédit</small></span>
        <span><strong>44 300 MAD</strong><small>TVA nette à déclarer</small></span>
        <span><strong>6 pièces</strong><small>Bloquants Clôture de période</small></span>
      </div>
      <div className="workspaceGrid two">
        <WorkspacePanel title="Nouvelle écriture" description="Validation stricte avant inscription au Journal Comptable.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Libellé comptable"><input value={label} onChange={(event) => setLabel(event.target.value)} /></FormField>
            <FormField label="Débit MAD"><input inputMode="decimal" value={debit} onChange={(event) => setDebit(event.target.value)} /></FormField>
            <FormField label="Crédit MAD"><input inputMode="decimal" value={credit} onChange={(event) => setCredit(event.target.value)} /></FormField>
            <label className="checkboxLine"><input type="checkbox" checked={periodLocked} onChange={(event) => setPeriodLocked(event.target.checked)} /> Simuler Clôture de période</label>
            <button type="submit">Créer écriture</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Contrôles comptables" description="Pré-requis avant verrouillage fiscal.">
          <div className="checkList">
            <span>PCGE aligné avec classes 1 à 7</span>
            <span>Pièces justificatives attachées aux OD sensibles</span>
            <span>Rapprochement bancaire revu avant Clôture de période</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Journaux récents">
        <DataTable columns={['Numéro', 'Journal', 'Source', 'Débit', 'Crédit', 'Statut']} rows={journals} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
