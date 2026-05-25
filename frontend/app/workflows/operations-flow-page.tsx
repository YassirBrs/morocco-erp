'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialJobs = [
  ['IMP-2026-022', 'Import Sage clients', 'Prévisualisation', '2 doublons ICE', 'Commercial'],
  ['EXP-2026-044', 'Pack comptable', 'Terminé', 'Checksum archivé', 'Comptable'],
  ['APP-2026-011', 'Remise devis', 'Approbation', 'SLA 4 h', 'Manager'],
];

export function OperationsFlowPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [kind, setKind] = useState('Import CSV');
  const [owner, setOwner] = useState('Comptable');
  const [reference, setReference] = useState('PCGE-OPENING-2026');
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (reference.trim().length < 6) {
      setToast({ tone: 'error', message: 'Référence workflow obligatoire pour relier tâches et preuves.' });
      return;
    }
    if (owner.trim().length < 4) {
      setToast({ tone: 'error', message: 'Responsable obligatoire avant routage de tâche.' });
      return;
    }
    const prefix = kind.startsWith('Import') ? 'IMP' : kind.startsWith('Export') ? 'EXP' : 'APP';
    const id = `${prefix}-2026-${String(jobs.length + 45).padStart(3, '0')}`;
    setJobs((current) => [[id, kind, 'Planifié', reference.trim(), owner.trim()], ...current]);
    setToast({ tone: 'success', message: `${id} routé avec statut, preuve et prochaine action.` });
  };

  return (
    <WorkspaceLayout activeModule="Workflows">
      <SectionHeader
        eyebrow="Centre opérationnel"
        title="Imports, exports, preuves et approbations"
        description="Orchestration transversale des flux CSV, PDF, e-mails, tâches, timelines et validations manager."
        action={<StatusBadge tone="warning">7 approbations</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Créer workflow" description="Chaque flux reçoit un owner, une preuve et un statut exploitable.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Type"><select value={kind} onChange={(event) => setKind(event.target.value)}><option>Import CSV</option><option>Export légal</option><option>Approbation</option></select></FormField>
            <FormField label="Référence"><input value={reference} onChange={(event) => setReference(event.target.value)} /></FormField>
            <FormField label="Responsable"><input value={owner} onChange={(event) => setOwner(event.target.value)} /></FormField>
            <button type="submit">Planifier workflow</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="États UX attendus" description="Contrats d’interface communs à tous les modules.">
          <div className="checkList">
            <span>Import preview avec erreurs DTO en français</span>
            <span>Export job avec checksum, rétention et statut</span>
            <span>Timeline et audit liés aux documents sources</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Flux actifs">
        <DataTable columns={['ID', 'Flux', 'Statut', 'Détail', 'Responsable']} rows={jobs} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
