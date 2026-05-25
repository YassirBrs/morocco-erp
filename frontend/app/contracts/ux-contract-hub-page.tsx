'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialContracts = [
  ['ListView', 'Filtres, tri, pagination', 'Validé', 'Ventes'],
  ['DetailView', 'Statut, actions, timeline', 'Validé', 'Comptabilité'],
  ['FormSchema', 'Champs requis Maroc', 'En revue', 'Paie/RH'],
  ['ActionResult', 'Toast, audit, prochaine action', 'Validé', 'Stock'],
];

export function UxContractHubPage() {
  const [contracts, setContracts] = useState(initialContracts);
  const [contractType, setContractType] = useState('ValidationError');
  const [moduleName, setModuleName] = useState('Conformité');
  const [message, setMessage] = useState('Champ ICE requis');
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim().length < 8) {
      setToast({ tone: 'error', message: 'Message contrat trop court: fournissez une correction lisible.' });
      return;
    }
    if (moduleName.trim().length < 3) {
      setToast({ tone: 'error', message: 'Module obligatoire pour isoler le contrat UX.' });
      return;
    }
    setContracts((current) => [[contractType, message.trim(), 'Ajouté', moduleName.trim()], ...current]);
    setToast({ tone: 'success', message: `${contractType} ajouté avec payload français et action suivante.` });
  };

  return (
    <WorkspaceLayout activeModule="Contrats UX">
      <SectionHeader
        eyebrow="Contrats UX ERP"
        title="Listes, détails, formulaires et résultats d’action"
        description="Contrats réutilisables pour garantir une expérience cohérente entre modules sans reconstruire un écran fourre-tout."
        action={<StatusBadge tone="success">Contrats app-level</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Nouveau contrat" description="Validation claire pour composants réutilisables.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Type contrat"><select value={contractType} onChange={(event) => setContractType(event.target.value)}><option>ValidationError</option><option>ListView</option><option>DetailView</option><option>FormSchema</option><option>ActionResult</option></select></FormField>
            <FormField label="Module"><input value={moduleName} onChange={(event) => setModuleName(event.target.value)} /></FormField>
            <FormField label="Message DTO"><input value={message} onChange={(event) => setMessage(event.target.value)} /></FormField>
            <button type="submit">Ajouter contrat</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Règles SOLID" description="Sub-components à construire séparément quand la vue grandit.">
          <div className="checkList">
            <span>Table pagination native et testable</span>
            <span>Filter sheet isolé par module et rôle</span>
            <span>Toast ActionResult DTO-mappé avec référence audit</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Contrats disponibles">
        <DataTable columns={['Contrat', 'Payload', 'Statut', 'Module']} rows={contracts} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
