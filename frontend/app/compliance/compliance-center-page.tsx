'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialChecks = [
  ['MA-2026', 'TVA', 'Déclaration mensuelle', 'Prêt archive'],
  ['MA-2026', 'CNSS/AMO', 'Damancom sandbox', 'Identifiants live absents'],
  ['MA-2026', 'Facturation', 'Mentions ICE/IF/RC', 'Conforme'],
];

export function ComplianceCenterPage() {
  const [checks, setChecks] = useState(initialChecks);
  const [adapter, setAdapter] = useState('DGI');
  const [reference, setReference] = useState('TVA-2026-05');
  const [evidence, setEvidence] = useState('archive-preuve-tva.pdf');
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reference.match(/^[A-Z]{2,6}-2026-[0-9A-Z-]{2,}$/)) {
      setToast({ tone: 'error', message: 'Référence conformité invalide: utilisez un code déclaratif lisible.' });
      return;
    }
    if (!evidence.endsWith('.pdf') && !evidence.endsWith('.csv')) {
      setToast({ tone: 'error', message: 'Preuve requise au format PDF ou CSV avant télédéclaration.' });
      return;
    }
    setChecks((current) => [['MA-2026', adapter, reference, `Preuve ${evidence} archivée`], ...current]);
    setToast({ tone: 'success', message: `${adapter}: enveloppe validée en mode sandbox, soumission live désactivée.` });
  };

  return (
    <WorkspaceLayout activeModule="Conformité">
      <SectionHeader
        eyebrow="Conformité Maroc"
        title="Règles MA-2026, DGI, CNSS et archives"
        description="Versionnez les rule packs, validez les enveloppes déclaratives et conservez les preuves avant intégration officielle."
        action={<StatusBadge tone="info">Sandbox seulement</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Préparer télédéclaration" description="Validation adapter et preuve avant archivage.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Adapter"><select value={adapter} onChange={(event) => setAdapter(event.target.value)}><option>DGI</option><option>CNSS</option><option>Banque</option></select></FormField>
            <FormField label="Référence"><input value={reference} onChange={(event) => setReference(event.target.value)} /></FormField>
            <FormField label="Fichier preuve"><input value={evidence} onChange={(event) => setEvidence(event.target.value)} /></FormField>
            <button type="submit">Valider enveloppe</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Mentions légales suivies" description="Données obligatoires au niveau tenant.">
          <div className="checkList">
            <span>ICE, IF, RC, Patente, CNSS et adresse légale</span>
            <span>Taux TVA autorisés: 0 %, 7 %, 10 %, 14 %, 20 %</span>
            <span>CNSS/AMO et IR conservés par rule pack versionné</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Rule packs et adapters">
        <DataTable columns={['Pack', 'Domaine', 'Contrôle', 'Statut']} rows={checks} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
