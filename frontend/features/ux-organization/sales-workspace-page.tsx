import { salesWorkspace, statusPipelines } from './erp-workspace-fixtures';
import {
  DenseDataTable,
  KpiStrip,
  NextStepActions,
  RecordDetailStandard,
  StatusPipeline,
  WorkspaceHeader,
  WorkspaceTabs,
  statusClass,
} from './erp-workspace-patterns';

export function SalesWorkspacePage() {
  return (
    <main className="modulePage uxRoutePage">
      <WorkspaceHeader
        eyebrow="Espace Ventes"
        title="Ventes, CRM et facturation client"
        subtitle="Pipeline commercial, devis, commandes, BL, factures, avoirs, encaissements et relances avec vocabulaire métier marocain."
        primaryAction="Nouveau devis"
        secondaryAction="Importer prospects"
      />
      <WorkspaceTabs tabs={['Pipeline', 'Devis', 'Commandes', 'Livraisons', 'Factures', 'Paiements', 'Clients 360']} />
      <KpiStrip
        items={[
          { label: 'CA facturé', value: '428 000 MAD', trend: '+12 % mois', status: 'ok' },
          { label: 'À encaisser', value: '86 400 MAD', trend: '7 factures échues', status: 'warning' },
          { label: 'Devis ouverts', value: '18', trend: '3 nécessitent validation', status: 'info' },
          { label: 'Risque crédit', value: '2 clients', trend: 'Blocage facture actif', status: 'danger' },
        ]}
      />

      <section className="uxPanel">
        <div className="uxPanelHeader">
          <div>
            <h2>Kanban pipeline CRM</h2>
            <p>Étapes, propriétaire, source, prochaine action et valeur attendue pour accélérer la conversion devis.</p>
          </div>
          <button type="button">Créer prospect</button>
        </div>
        <div className="uxKanban">
          {salesWorkspace.pipeline.map((column) => (
            <article key={column.stage}>
              <strong>{column.stage}</strong>
              <span>{column.count} opportunités · {column.value}</span>
              <p>{column.owner}</p>
            </article>
          ))}
        </div>
      </section>

      <DenseDataTable
        title="Documents commerciaux"
        columns={[
          { label: 'Document', sortable: true },
          { label: 'Client', sortable: true },
          { label: 'Total TTC', sortable: true, numeric: true },
          { label: 'Statut', sortable: true },
          { label: 'Contrôle', sortable: true },
        ]}
        rows={salesWorkspace.documents.map((row) => ({
          cells: row,
          status: row[3].includes('Échue') || row[3].includes('requise') ? 'warning' : 'info',
        }))}
      />

      <div className="uxWorkspaceGrid">
        <StatusPipeline title="Devis vers encaissement en un clic" steps={statusPipelines.sales} />
        <NextStepActions actions={['Approuver devis', 'Convertir en commande', 'Créer BL', 'Créer facture', 'Capturer paiement', 'Envoyer PDF client']} />
      </div>

      <RecordDetailStandard title="DV-2026-022" status="Approbation requise" meta="Atlas Bureautique SARL · ICE 001525874000033 · IF 15258740 · RC Casablanca 98421">
        <DenseDataTable
          title="Lignes devis / facture"
          columns={[
            { label: 'Article', sortable: true },
            { label: 'Désignation', sortable: true },
            { label: 'Qté', numeric: true },
            { label: 'Prix HT', numeric: true },
            { label: 'TVA', sortable: true },
            { label: 'Total TTC', numeric: true },
          ]}
          rows={salesWorkspace.documentLines.map((cells) => ({ cells, status: 'ok' }))}
        />
        <div className="uxTotalsPanel" id="facture-preview">
          <div><span>Sous-total HT</span><strong>15 600 MAD</strong></div>
          <div><span>TVA 20 %</span><strong>3 120 MAD</strong></div>
          <div><span>Total TTC</span><strong>18 720 MAD</strong></div>
          <div><span>Solde client</span><strong className={statusClass('warning')}>18 240 MAD impayés</strong></div>
        </div>
      </RecordDetailStandard>

      <div className="uxWorkspaceGrid">
        <section className="uxPanel" id="client-360">
          <div className="uxPanelHeader">
            <div>
              <h2>Client 360</h2>
              <p>Identité, soldes, documents, timeline, litiges, promesses et risque crédit.</p>
            </div>
            <button className="uxSecondaryButton" type="button">Ouvrir fiche client</button>
          </div>
          <div className="uxIdentityGrid">
            <div><span>ICE</span><strong>001525874000033</strong></div>
            <div><span>Adresse</span><strong>Casablanca, Maroc</strong></div>
            <div><span>Limite crédit</span><strong>120 000 MAD</strong></div>
            <div><span>Risque</span><strong className={statusClass('warning')}>Surveillance</strong></div>
          </div>
          <ul className="uxTimeline">
            {salesWorkspace.customerTimeline.map((event) => <li key={event}>{event}</li>)}
          </ul>
        </section>

        <DenseDataTable
          title="Suivi des impayés"
          columns={[
            { label: 'Âge', sortable: true },
            { label: 'Montant', sortable: true, numeric: true },
            { label: 'Volume', sortable: true },
            { label: 'Action', sortable: true },
          ]}
          rows={salesWorkspace.unpaid.map((cells) => ({ cells, status: cells[3].includes('Blocage') ? 'danger' : 'warning' }))}
          emptyAction="Planifier relance"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <section className="uxPanel">
          <div className="uxPanelHeader">
            <div>
              <h2>Aperçu facture conforme Maroc</h2>
              <p>Mentions ICE, IF, RC, Patente, série, TVA par ligne, statut PDF et langue document.</p>
            </div>
            <button type="button">Exporter PDF</button>
          </div>
          <div className="uxDocumentPreview">
            <strong>FAC-2026-014</strong>
            <span>ICE vendeur 001525874000033 · IF 15258740 · RC 98421 · Patente P-2026-CASA</span>
            <span>Client Casa Retail · TVA 20 % · Série FAC-2026 · PDF prêt</span>
          </div>
        </section>

        <DenseDataTable
          title="Avoir avec impact comptable"
          columns={[
            { label: 'Ligne', sortable: true },
            { label: 'Qté', numeric: true },
            { label: 'Motif', sortable: true },
            { label: 'Montant', numeric: true },
            { label: 'Impact TVA', sortable: true },
          ]}
          rows={salesWorkspace.creditNoteLines.map((cells) => ({ cells, status: 'warning' }))}
          emptyAction="Créer avoir"
        />
      </div>
    </main>
  );
}
