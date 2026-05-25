'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialUsers = [
  ['youssef@atlas.ma', 'Owner', 'Toutes permissions', 'MFA actif'],
  ['compta@atlas.ma', 'Comptable', 'Journal Comptable, TVA', 'MFA requis'],
  ['caisse@atlas.ma', 'Caissier', 'POS, tickets', 'Accès limité'],
];

export function AdminConsolePage() {
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState('stock@atlas.ma');
  const [role, setRole] = useState('Gestionnaire stock');
  const [mfaRequired, setMfaRequired] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes('@') || !email.endsWith('.ma')) {
      setToast({ tone: 'error', message: 'Invitation rejetée: utilisez une adresse professionnelle .ma valide.' });
      return;
    }
    if (role.trim().length < 4) {
      setToast({ tone: 'error', message: 'Rôle obligatoire pour appliquer la matrice RBAC.' });
      return;
    }
    setUsers((current) => [[email.trim(), role.trim(), 'Accès en attente de validation', mfaRequired ? 'MFA requis' : 'MFA conseillé'], ...current]);
    setToast({ tone: 'success', message: `Invitation envoyée à ${email.trim()} avec audit administrateur.` });
  };

  return (
    <WorkspaceLayout activeModule="Admin">
      <SectionHeader
        eyebrow="Administration tenant"
        title="Utilisateurs, rôles et paramètres société"
        description="Gestion des accès, séparation des tâches, numérotation et diagnostics sans exposer les modules internes au public."
        action={<StatusBadge tone="warning">3 rôles sensibles</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Inviter utilisateur" description="Contrôle e-mail, rôle et MFA avant activation.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Adresse e-mail"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></FormField>
            <FormField label="Rôle ERP"><input value={role} onChange={(event) => setRole(event.target.value)} /></FormField>
            <label className="checkboxLine"><input type="checkbox" checked={mfaRequired} onChange={(event) => setMfaRequired(event.target.checked)} /> MFA obligatoire</label>
            <button type="submit">Inviter utilisateur</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Paramètres critiques" description="Actions administratives suivies dans l’audit.">
          <div className="checkList">
            <span>Séries factures FAC-2026 et avoirs NC-2026 verrouillées</span>
            <span>Rôles comptabilité et caisse séparés</span>
            <span>Feature gates abonnement appliqués avant écriture</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Accès actifs">
        <DataTable columns={['Utilisateur', 'Rôle', 'Permission', 'Sécurité']} rows={users} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
