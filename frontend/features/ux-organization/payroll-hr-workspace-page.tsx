import { payrollWorkspace } from './erp-operations-fixtures';
import { DenseDataTable, KpiStrip, WorkspaceHeader, WorkspaceTabs, statusClass } from './erp-workspace-patterns';

export function PayrollHrWorkspacePage() {
  return (
    <main className="modulePage uxRoutePage">
      <WorkspaceHeader
        eyebrow="Espace Paie/RH"
        title="Paie Maroc, RH et Damancom"
        subtitle="Salariés, contrats, runs paie, bulletins, congés, CNSS, AMO, IR, export Damancom et documents RH restreints."
        primaryAction="Lancer run paie"
        secondaryAction="Importer salariés"
      />
      <WorkspaceTabs tabs={['Salariés', 'Contrats', 'Run paie', 'Calcul', 'Damancom', 'Congés', 'Documents RH']} />
      <KpiStrip
        items={[
          { label: 'Salariés actifs', value: '42', trend: '2 dossiers incomplets', status: 'warning' },
          { label: 'Net à payer', value: '318 900 MAD', trend: 'Run calculé', status: 'info' },
          { label: 'Charges employeur', value: '72 600 MAD', trend: 'CNSS/AMO estimées', status: 'ok' },
          { label: 'Congés en attente', value: '6', trend: '1 conflit équipe', status: 'warning' },
        ]}
      />

      <DenseDataTable
        title="Salarié 360"
        columns={[
          { label: 'Matricule', sortable: true },
          { label: 'Nom', sortable: true },
          { label: 'CIN', sortable: true },
          { label: 'CNSS', sortable: true },
          { label: 'Salaire', sortable: true, numeric: true },
          { label: 'Accès', sortable: true },
        ]}
        rows={payrollWorkspace.employees.map((cells) => ({ cells, status: cells[3].includes('manquant') ? 'danger' : 'ok' }))}
        emptyAction="Créer salarié"
      />

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Assistant run paie"
          columns={[
            { label: 'Contrôle', sortable: true },
            { label: 'Valeur', sortable: true },
            { label: 'Statut', sortable: true },
            { label: 'Correction', sortable: true },
          ]}
          rows={payrollWorkspace.runPreflight.map((cells) => ({ cells, status: cells[2] === 'Bloquant' ? 'danger' : 'ok' }))}
          emptyAction="Calculer brut-net"
        />
        <section className="uxPanel">
          <div className="uxPanelHeader">
            <div>
              <h2>Explication de calcul paie</h2>
              <p>CNSS plafonnée, AMO non plafonnée, tranche IR, personnes à charge, charges employeur et net à payer.</p>
            </div>
            <button type="button">Voir bulletin</button>
          </div>
          <div className="uxSetupGrid">
            {payrollWorkspace.explanations.map(([title, detail, note]) => (
              <article key={title}>
                <strong>{title}</strong>
                <span>{detail}</span>
                <em className={statusClass('info')}>{note}</em>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Validation Damancom"
          columns={[
            { label: 'Ligne', sortable: true },
            { label: 'Longueur', sortable: true },
            { label: 'Statut', sortable: true },
            { label: 'Archive', sortable: true },
          ]}
          rows={payrollWorkspace.damancom.map((cells) => ({ cells, status: cells[2] === 'Erreur' ? 'danger' : 'ok' }))}
          emptyAction="Générer fichier Damancom"
        />
        <DenseDataTable
          title="Calendrier congés"
          columns={[
            { label: 'Équipe', sortable: true },
            { label: 'Demandes', sortable: true },
            { label: 'Conflits', sortable: true },
            { label: 'Impact', sortable: true },
          ]}
          rows={payrollWorkspace.leave.map((cells) => ({ cells, status: cells[2].startsWith('0') ? 'ok' : 'warning' }))}
          emptyAction="Créer demande congé"
        />
      </div>

      <DenseDataTable
        title="Centre documents RH"
        columns={[
          { label: 'Document', sortable: true },
          { label: 'Salarié', sortable: true },
          { label: 'Échéance', sortable: true },
          { label: 'Accès', sortable: true },
          { label: 'Caviardage', sortable: true },
        ]}
        rows={payrollWorkspace.documents.map((cells) => ({ cells, status: cells[4].includes('Non') ? 'warning' : 'ok' }))}
        emptyAction="Ajouter document RH"
      />
    </main>
  );
}
