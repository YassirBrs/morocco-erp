'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialSuppliers = [
  ['Fournitures Nord', '001587463000021', 'IF 4587210', '60 jours', 'CIH Bank', 'Préféré'],
  ['Casa Emballage', '001699874000012', 'IF 5542109', '30 jours', 'Attijariwafa bank', 'À surveiller'],
  ['Agri Atlas', '001366998000044', 'IF 8820145', '45 jours', 'Bank of Africa', 'Actif'],
];

export function SupplierDirectoryPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [name, setName] = useState('Techno Bureau SARL');
  const [ice, setIce] = useState('001525678000083');
  const [rib, setRib] = useState('230 780 1234567890123456 12');
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedIce = ice.replace(/\D/g, '');
    const normalizedRib = rib.replace(/\D/g, '');
    if (name.trim().length < 3) {
      setToast({ tone: 'error', message: 'Nom fournisseur obligatoire avant enregistrement.' });
      return;
    }
    if (normalizedIce.length !== 15) {
      setToast({ tone: 'error', message: 'ICE fournisseur invalide: 15 chiffres sont requis au Maroc.' });
      return;
    }
    if (normalizedRib.length < 24) {
      setToast({ tone: 'error', message: 'RIB marocain invalide: contrôlez la clé bancaire avant validation.' });
      return;
    }
    setSuppliers((current) => [[name.trim(), normalizedIce, 'IF à compléter', '30 jours', 'Banque normalisée', 'Nouveau'], ...current]);
    setToast({ tone: 'success', message: `Fournisseur ${name.trim()} ajouté au registre achats.` });
  };

  return (
    <WorkspaceLayout activeModule="Fournisseurs">
      <SectionHeader
        eyebrow="Achats"
        title="Annuaire fournisseurs"
        description="Registre fournisseurs isolé avec ICE, IF, conditions de paiement, RIB et signaux de risque."
        action={<StatusBadge tone="warning">Doublons ICE/IF surveillés</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Créer fournisseur" description="Contrôles minimaux ICE/RIB avant ajout à l’annuaire.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Nom fournisseur">
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </FormField>
            <FormField label="ICE">
              <input inputMode="numeric" value={ice} onChange={(event) => setIce(event.target.value)} />
            </FormField>
            <FormField label="RIB marocain">
              <input value={rib} onChange={(event) => setRib(event.target.value)} />
            </FormField>
            <button type="submit">Enregistrer fournisseur</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Contrôles achats" description="Vue opérationnelle sans widgets de ventes ou paie.">
          <div className="checkList">
            <span>Conditions de paiement normalisées</span>
            <span>RIB et banque préparés pour paiement fournisseur</span>
            <span>Alertes document fournisseur et préférence achat</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Registre fournisseurs">
        <DataTable columns={['Fournisseur', 'ICE', 'IF', 'Paiement', 'Banque', 'Statut']} rows={suppliers} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
