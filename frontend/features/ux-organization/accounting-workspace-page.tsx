import { accountingWorkspace } from './erp-operations-fixtures';
import { statusPipelines } from './erp-workspace-fixtures';
import { DenseDataTable, KpiStrip, RecordDetailStandard, StatusPipeline, WorkspaceHeader, WorkspaceTabs, statusClass } from './erp-workspace-patterns';

export function AccountingWorkspacePage() {
  return (
    <main className="modulePage uxRoutePage">
      <WorkspaceHeader
        eyebrow="Espace Comptabilité"
        title="Comptabilité PCGE, TVA et clôture"
        subtitle="Comptes PCGE, journaux, périodes fiscales, rapprochement bancaire, exports et archive de preuves pour cabinet comptable marocain."
        primaryAction="Nouvelle écriture"
        secondaryAction="Exporter balance"
      />
      <WorkspaceTabs tabs={['PCGE', 'Journaux', 'TVA', 'Périodes', 'Banque', 'Preuves', 'Revue comptable']} />
      <KpiStrip
        items={[
          { label: 'Balance', value: 'Équilibrée', trend: 'Débit = Crédit', status: 'ok' },
          { label: 'TVA nette', value: '44 300 MAD', trend: 'Échéance 20/06', status: 'warning' },
          { label: 'Pièces manquantes', value: '6', trend: 'Bloquant clôture', status: 'danger' },
          { label: 'Banque à matcher', value: '14 lignes', trend: 'Suggestions prêtes', status: 'info' },
        ]}
      />

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Sélecteur PCGE"
          columns={[
            { label: 'Compte', sortable: true },
            { label: 'Libellé', sortable: true },
            { label: 'Favori', sortable: true },
            { label: 'Classe', sortable: true },
            { label: 'Règle Maroc', sortable: true },
          ]}
          rows={accountingWorkspace.accounts.map((cells) => ({ cells, status: cells[2] === 'Favori' ? 'info' : 'ok' }))}
          emptyAction="Importer PCGE"
        />
        <DenseDataTable
          title="Journaux et écritures"
          columns={[
            { label: 'Journal', sortable: true },
            { label: 'Libellé', sortable: true },
            { label: 'Volume', sortable: true },
            { label: 'Équilibre', sortable: true },
            { label: 'Statut', sortable: true },
          ]}
          rows={accountingWorkspace.journals.map((cells) => ({ cells, status: cells[4] === 'Brouillon' ? 'warning' : 'ok' }))}
          emptyAction="Créer journal"
        />
      </div>

      <RecordDetailStandard title="OD-2026-008" status="Brouillon" meta="Source: provision stock · pièce attendue · période 05/2026 ouverte">
        <div className="uxTotalsPanel">
          <div><span>Débit</span><strong>14 200 MAD</strong></div>
          <div><span>Crédit</span><strong>14 200 MAD</strong></div>
          <div><span>Indicateur</span><strong className={statusClass('ok')}>Écriture équilibrée</strong></div>
          <div><span>Document source</span><strong>INV-COUNT-05</strong></div>
        </div>
      </RecordDetailStandard>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Cockpit TVA"
          columns={[
            { label: 'Taux', sortable: true },
            { label: 'TVA collectée', sortable: true, numeric: true },
            { label: 'TVA déductible', sortable: true, numeric: true },
            { label: 'Net', sortable: true, numeric: true },
            { label: 'Exceptions', sortable: true },
          ]}
          rows={accountingWorkspace.vat.map((cells) => ({ cells, status: cells[4].startsWith('0') ? 'ok' : 'warning' }))}
          emptyAction="Préparer déclaration TVA"
        />
        <DenseDataTable
          title="Centre de clôture fiscale"
          columns={[
            { label: 'Blocage', sortable: true },
            { label: 'Volume', sortable: true },
            { label: 'Responsable', sortable: true },
            { label: 'Impact', sortable: true },
          ]}
          rows={accountingWorkspace.closeBlockers.map((cells) => ({ cells, status: cells[3] === 'Bloquant' ? 'danger' : 'warning' }))}
          emptyAction="Créer checklist clôture"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Rapprochement bancaire"
          columns={[
            { label: 'Ligne banque', sortable: true },
            { label: 'Montant', sortable: true, numeric: true },
            { label: 'Suggestion', sortable: true },
            { label: 'Confiance', sortable: true },
            { label: 'Action', sortable: true },
          ]}
          rows={accountingWorkspace.bankMatches.map((cells) => ({ cells, status: cells[4].includes('proposé') ? 'info' : 'warning' }))}
          emptyAction="Importer relevé bancaire"
        />
        <section className="uxPanel">
          <div className="uxPanelHeader">
            <div>
              <h2>Mode revue comptable</h2>
              <p>Commentaires, demandes de preuves, propriétaire, échéance et statut sur chaque document comptable.</p>
            </div>
            <button type="button">Demander preuve</button>
          </div>
          <ul className="uxTimeline">
            <li>Youssef a demandé la pièce OD-2026-008 avant verrouillage.</li>
            <li>Expert-comptable: TVA 20 % vérifiée, exonération à justifier.</li>
            <li>Archive légale: checksum généré après export du pack.</li>
          </ul>
        </section>
      </div>

      <StatusPipeline title="Pipeline clôture comptable" steps={statusPipelines.inventory} />
    </main>
  );
}
