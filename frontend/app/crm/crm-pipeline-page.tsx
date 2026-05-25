'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel, formatMad } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialLeads = [
  ['Atlas Retail', 'Qualification', 'Nadia Amrani', '85 000 MAD', '15/06/2026'],
  ['Clinique Maarif', 'Devis envoyé', 'Yassir Bouras', '132 000 MAD', '02/06/2026'],
  ['Tanger Logistics', 'Négociation', 'Nadia Amrani', '240 000 MAD', '28/05/2026'],
];

export function CrmPipelinePage() {
  const [leads, setLeads] = useState(initialLeads);
  const [name, setName] = useState('Rabat Services');
  const [value, setValue] = useState('56000');
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericValue = Number(value);
    if (name.trim().length < 3) {
      setToast({ tone: 'error', message: 'Nom prospect obligatoire: minimum 3 caractères.' });
      return;
    }
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setToast({ tone: 'error', message: 'Valeur attendue invalide: saisissez un montant MAD positif.' });
      return;
    }
    setLeads((current) => [[name.trim(), 'Nouveau prospect', 'Direction', formatMad(numericValue), 'À planifier'], ...current]);
    setToast({ tone: 'success', message: `Prospect ${name.trim()} ajouté au pipeline CRM.` });
  };

  return (
    <WorkspaceLayout activeModule="CRM">
      <SectionHeader
        eyebrow="CRM"
        title="Pipeline commercial"
        description="Pilotez prospects, opportunités, prochaines actions et conversion en devis sans mélanger les écrans de facturation."
        action={<StatusBadge tone="info">Vue Kanban + table</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Nouveau prospect" description="Validation DTO simulée côté interface avant création.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Nom prospect" hint="Client, société ou groupe cible.">
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </FormField>
            <FormField label="Valeur estimée MAD">
              <input inputMode="numeric" value={value} onChange={(event) => setValue(event.target.value)} />
            </FormField>
            <button type="submit">Ajouter au pipeline</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Synthèse CRM" description="Vocabulaire commercial unifié pour les équipes ventes.">
          <div className="kpiStrip">
            <span><strong>{leads.length}</strong> opportunités</span>
            <span><strong>457 000 MAD</strong> pipeline pondéré</span>
            <span><strong>3</strong> relances cette semaine</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Registre des opportunités" description="Tri, filtres et pagination seront extraits dans les prochains composants natifs.">
        <DataTable columns={['Prospect', 'Étape', 'Responsable', 'Valeur', 'Prochaine action']} rows={leads} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
