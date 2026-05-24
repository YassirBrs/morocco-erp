import { purchasesInventoryWorkspace, statusPipelines } from './erp-workspace-fixtures';
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

export function PurchasesInventoryWorkspacePage() {
  return (
    <main className="modulePage uxRoutePage">
      <WorkspaceHeader
        eyebrow="Espace Achats/Stock"
        title="Achats, fournisseurs et inventaire"
        subtitle="Demandes d'achat, commandes fournisseurs, réceptions, factures, CUMP, réservations, dépôts et inventaires dans un écran dense."
        primaryAction="Créer demande achat"
        secondaryAction="Scanner code-barres"
      />
      <WorkspaceTabs tabs={['Vue d’ensemble', 'Fournisseurs', 'Commandes', 'Réceptions', 'Factures fournisseurs', 'Articles', 'Dépôts', 'Inventaires']} />
      <KpiStrip
        items={[
          { label: 'Valeur CUMP', value: '479 000 MAD', trend: 'Valorisation contrôlée', status: 'ok' },
          { label: 'Articles critiques', value: '11', trend: '4 ruptures probables', status: 'danger' },
          { label: 'Réceptions attendues', value: '9', trend: '2 en retard', status: 'warning' },
          { label: 'Factures à matcher', value: '6', trend: '3 écarts prix/TVA', status: 'warning' },
        ]}
      />

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Fournisseurs 360"
          columns={[
            { label: 'Fournisseur', sortable: true },
            { label: 'ICE/IF', sortable: true },
            { label: 'RIB/KYS', sortable: true },
            { label: 'Score', sortable: true },
            { label: 'Statut', sortable: true },
          ]}
          rows={purchasesInventoryWorkspace.suppliers.map((cells) => ({
            cells,
            status: cells[4].includes('Bloqué') ? 'danger' : cells[4].includes('Surveillance') ? 'warning' : 'ok',
          }))}
          emptyAction="Créer fournisseur"
        />

        <DenseDataTable
          title="Demandes et commandes achat"
          columns={[
            { label: 'Document', sortable: true },
            { label: 'Fournisseur', sortable: true },
            { label: 'Montant', sortable: true, numeric: true },
            { label: 'Statut', sortable: true },
            { label: 'Impact', sortable: true },
          ]}
          rows={purchasesInventoryWorkspace.purchaseOrders.map((cells) => ({
            cells,
            status: cells[3].includes('requise') ? 'warning' : 'info',
          }))}
          emptyAction="Créer commande achat"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <StatusPipeline title="Flux achat et réception" steps={statusPipelines.purchase} />
        <NextStepActions actions={['Comparer devis fournisseurs', 'Approuver BC', 'Réceptionner', 'Rapprocher facture', 'Préparer paiement', 'Archiver preuve']} />
      </div>

      <RecordDetailStandard title="BC-2026-018" status="Réception partielle" meta="Fournitures Nord · RIB validé · livraison Casablanca · budget consommé 64 %">
        <div className="uxIdentityGrid">
          <div><span>Chemin approbation</span><strong>Achats → Direction → Comptable</strong></div>
          <div><span>Conditions</span><strong>30 jours fin de mois</strong></div>
          <div><span>Landed cost</span><strong>Transit 2 400 MAD · assurance 600 MAD</strong></div>
          <div><span>Impact budget</span><strong className={statusClass('warning')}>64 % consommé</strong></div>
        </div>
      </RecordDetailStandard>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Réception magasin optimisée"
          columns={[
            { label: 'SKU', sortable: true },
            { label: 'Code-barres', sortable: true },
            { label: 'Quantité reçue', sortable: true },
            { label: 'Écart', sortable: true },
            { label: 'Impact CUMP', sortable: true },
          ]}
          rows={purchasesInventoryWorkspace.receipts.map((cells) => ({
            cells,
            status: cells[3].includes('Écart') ? 'warning' : 'ok',
          }))}
          emptyAction="Créer réception"
        />

        <DenseDataTable
          title="Rapprochement facture fournisseur"
          columns={[
            { label: 'BC', sortable: true },
            { label: 'Réception', sortable: true },
            { label: 'Facture', sortable: true },
            { label: 'TVA', sortable: true },
            { label: 'Exception', sortable: true },
          ]}
          rows={purchasesInventoryWorkspace.invoiceMatches.map((cells) => ({
            cells,
            status: cells[4].includes('bloqué') || cells[4].includes('Écart') ? 'warning' : 'ok',
          }))}
          emptyAction="Importer facture fournisseur"
        />
      </div>

      <section className="uxPanel">
        <div className="uxPanelHeader">
          <div>
            <h2>Inventaire et stock par dépôt</h2>
            <p>Disponible, réservé, bloqué, quarantaine, valorisation, alertes de réapprovisionnement et libération des réservations.</p>
          </div>
          <button type="button">Lancer inventaire</button>
        </div>
        <DenseDataTable
          title="Vue stock opérationnelle"
          columns={[
            { label: 'SKU', sortable: true },
            { label: 'Article', sortable: true },
            { label: 'Dépôt', sortable: true },
            { label: 'Disponible', sortable: true, numeric: true },
            { label: 'Réservé', sortable: true, numeric: true },
            { label: 'Valorisation', sortable: true, numeric: true },
            { label: 'Alerte', sortable: true },
          ]}
          rows={purchasesInventoryWorkspace.stockOverview.map((cells) => ({
            cells,
            status: cells[6].includes('Sous') || cells[6].includes('Quarantaine') ? 'warning' : 'ok',
          }))}
          emptyAction="Créer article"
        />
      </section>

      <div className="uxWorkspaceGrid">
        <section className="uxPanel">
          <div className="uxPanelHeader">
            <div>
              <h2>Article 360</h2>
              <p>SKU, code-barres, TVA, prix, CUMP, stock dépôt, réservations, ventes et achats.</p>
            </div>
            <button className="uxSecondaryButton" type="button">Ouvrir SKU-CHAIR</button>
          </div>
          <div className="uxIdentityGrid">
            <div><span>SKU</span><strong>SKU-CHAIR</strong></div>
            <div><span>Code-barres</span><strong>6111000000010</strong></div>
            <div><span>TVA</span><strong>20 %</strong></div>
            <div><span>CUMP</span><strong>524 MAD</strong></div>
          </div>
          <ul className="uxTimeline">
            {purchasesInventoryWorkspace.productHistory.map((event) => <li key={event}>{event}</li>)}
          </ul>
        </section>

        <DenseDataTable
          title="Carte des dépôts"
          columns={[
            { label: 'Dépôt', sortable: true },
            { label: 'Lignes', sortable: true },
            { label: 'Disponible', sortable: true },
            { label: 'Réservé', sortable: true },
            { label: 'Bloqué/quarantaine', sortable: true },
            { label: 'Valorisation', sortable: true, numeric: true },
          ]}
          rows={purchasesInventoryWorkspace.warehouses.map((cells) => ({
            cells,
            status: cells[4].includes('7') || cells[4].includes('3') ? 'warning' : 'ok',
          }))}
          emptyAction="Créer dépôt"
        />
      </div>

      <StatusPipeline title="Inventaire physique et validation écart" steps={statusPipelines.inventory} />
    </main>
  );
}
