'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel, formatMad } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialRuns = [
  ['PAY-2026-05', 'Mai 2026', 'Calculé', '3 salariés', '64 800 MAD'],
  ['PAY-2026-04', 'Avril 2026', 'Comptabilisé', '3 salariés', '64 800 MAD'],
];

export function PayrollProcessingPage() {
  const [runs, setRuns] = useState(initialRuns);
  const [period, setPeriod] = useState('Juin 2026');
  const [employees, setEmployees] = useState('3');
  const [gross, setGross] = useState('64800');
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const employeeCount = Number(employees);
    const grossAmount = Number(gross);
    if (period.trim().length < 6) {
      setToast({ tone: 'error', message: 'Période paie obligatoire, par exemple Juin 2026.' });
      return;
    }
    if (!Number.isInteger(employeeCount) || employeeCount <= 0) {
      setToast({ tone: 'error', message: 'Nombre de salariés invalide pour le run de paie.' });
      return;
    }
    if (!Number.isFinite(grossAmount) || grossAmount <= 0) {
      setToast({ tone: 'error', message: 'Salaire brut total invalide avant calcul CNSS/AMO/IR.' });
      return;
    }
    const number = `PAY-2026-${String(runs.length + 4).padStart(2, '0')}`;
    setRuns((current) => [[number, period.trim(), 'Brouillon contrôlé', `${employeeCount} salariés`, formatMad(grossAmount)], ...current]);
    setToast({ tone: 'success', message: `${number} créé: Bulletins de paie prêts pour calcul CNSS, AMO et IR.` });
  };

  return (
    <WorkspaceLayout activeModule="Paie">
      <SectionHeader
        eyebrow="Paie/RH"
        title="Traitement de la paie"
        description="Runs mensuels, Bulletins de paie, Damancom, écritures et contrôles sociaux dans un écran dédié."
        action={<StatusBadge tone="info">Règles MA-2026</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Nouveau run paie" description="Contrôles préalables avant calcul social et fiscal.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Période">
              <input value={period} onChange={(event) => setPeriod(event.target.value)} />
            </FormField>
            <FormField label="Nombre de salariés">
              <input inputMode="numeric" value={employees} onChange={(event) => setEmployees(event.target.value)} />
            </FormField>
            <FormField label="Brut total MAD">
              <input inputMode="decimal" value={gross} onChange={(event) => setGross(event.target.value)} />
            </FormField>
            <button type="submit">Créer run paie</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Contrôles sociaux" description="Préparation avant approbation et Journal Comptable.">
          <div className="checkList">
            <span>CNSS plafonnée selon pack de règles</span>
            <span>AMO et IR expliqués par salarié</span>
            <span>Damancom validé avant export fixe</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Runs et Bulletins de paie">
        <DataTable columns={['Run', 'Période', 'Statut', 'Effectif', 'Brut']} rows={runs} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
