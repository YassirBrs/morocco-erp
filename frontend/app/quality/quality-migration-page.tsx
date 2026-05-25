'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialGates = [
  ['Sage 100 import', 'Clients/fournisseurs', '92 %', '12 doublons à résoudre'],
  ['Odoo import', 'Produits/stock', '88 %', 'CUMP à confirmer'],
  ['Playwright UX', 'Parcours facture', 'Pass', 'Capture archivée'],
  ['Accessibilité', 'Navigation clavier', 'Pass', 'Focus visible'],
];

export function QualityMigrationPage() {
  const [gates, setGates] = useState(initialGates);
  const [source, setSource] = useState('Sage 100');
  const [coverage, setCoverage] = useState('95');
  const [blocker, setBlocker] = useState('Aucun bloquant critique');
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const coverageValue = Number(coverage);
    if (!Number.isFinite(coverageValue) || coverageValue < 80 || coverageValue > 100) {
      setToast({ tone: 'error', message: 'Couverture migration attendue entre 80 % et 100 %.' });
      return;
    }
    if (blocker.trim().length < 5) {
      setToast({ tone: 'error', message: 'Statut bloquant obligatoire pour décider le go-live.' });
      return;
    }
    setGates((current) => [[`${source} readiness`, 'Données importées', `${coverageValue} %`, blocker.trim()], ...current]);
    setToast({ tone: coverageValue >= 95 ? 'success' : 'info', message: `${source}: contrôle ajouté au gate de release.` });
  };

  return (
    <WorkspaceLayout activeModule="Qualité">
      <SectionHeader
        eyebrow="Qualité et migration"
        title="Readiness Sage/Odoo, tests et release gate"
        description="Suivi des imports, doublons, qualité données, captures UX, accessibilité et blocage de release."
        action={<StatusBadge tone="danger">Release gate actif</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Ajouter contrôle" description="Qualifie les migrations et tests avant go-live.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Source"><select value={source} onChange={(event) => setSource(event.target.value)}><option>Sage 100</option><option>Odoo</option><option>Playwright UX</option><option>Accessibilité</option></select></FormField>
            <FormField label="Couverture %"><input inputMode="numeric" value={coverage} onChange={(event) => setCoverage(event.target.value)} /></FormField>
            <FormField label="Bloquant ou commentaire"><input value={blocker} onChange={(event) => setBlocker(event.target.value)} /></FormField>
            <button type="submit">Ajouter au gate</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Critères go-live" description="Aucun lancement sans preuve vérifiable.">
          <div className="checkList">
            <span>Doublons clients, fournisseurs et produits résolus</span>
            <span>Balances, stock et comptes d’ouverture rapprochés</span>
            <span>Tests backend, frontend, build et navigateur verts</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Gates release">
        <DataTable columns={['Gate', 'Périmètre', 'Score', 'Statut']} rows={gates} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
