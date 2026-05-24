import { posWorkspace } from './erp-operations-fixtures';
import { DenseDataTable, KpiStrip, WorkspaceHeader, WorkspaceTabs, statusClass } from './erp-workspace-patterns';

export function PosWorkspacePage() {
  return (
    <main className="modulePage uxRoutePage uxPosMode">
      <WorkspaceHeader
        eyebrow="Espace POS"
        title="Caisse, tickets et Z report"
        subtitle="Session caisse, vente tactile, recherche produit, code-barres, panier, TVA, paiements, remboursements, offline queue et stock synchronisé."
        primaryAction="Ouvrir session"
        secondaryAction="Mode tablette"
      />
      <WorkspaceTabs tabs={['Caisse', 'Tickets', 'Paiements', 'Remboursements', 'Z report', 'Offline sync']} />
      <KpiStrip
        items={[
          { label: 'Session', value: 'POS-CASA-02', trend: 'Ouverte depuis 4 h', status: 'info' },
          { label: 'Ventes jour', value: '21 360 MAD', trend: 'TVA incluse', status: 'ok' },
          { label: 'Écart caisse', value: '-130 MAD', trend: 'Motif requis', status: 'warning' },
          { label: 'Offline queue', value: '4 tickets', trend: '1 doublon possible', status: 'danger' },
        ]}
      />

      <section className="uxPanel">
        <div className="uxPanelHeader">
          <div>
            <h2>Écran caisse tactile</h2>
            <p>Recherche produit, code-barres, panier, TVA, paiement et reçu avec cibles tactiles larges.</p>
          </div>
          <button type="button">Encaisser</button>
        </div>
        <div className="uxPosGrid">
          <div className="uxPosSearch">
            <label>
              <span>Code-barres ou article</span>
              <input defaultValue="6111000000010" aria-label="Scanner ou rechercher article POS" />
            </label>
            {['Chaise bureau', 'Table assemblée', 'Service livraison', 'Remise autorisée'].map((item) => (
              <button key={item} className="uxSecondaryButton" type="button">{item}</button>
            ))}
          </div>
          <div className="uxPosCart">
            <strong>Panier</strong>
            <span>2 x SKU-CHAIR · 2 500 MAD HT</span>
            <span>TVA 20 % · 500 MAD</span>
            <span>Total TTC · 3 000 MAD</span>
            <button type="button">Paiement carte</button>
            <button className="uxSecondaryButton" type="button">Paiement espèces</button>
          </div>
        </div>
      </section>

      <DenseDataTable
        title="Tickets et paiements"
        columns={[
          { label: 'Ticket', sortable: true },
          { label: 'Caisse', sortable: true },
          { label: 'Total', sortable: true, numeric: true },
          { label: 'Paiement', sortable: true },
          { label: 'Stock', sortable: true },
          { label: 'Reçu', sortable: true },
        ]}
        rows={posWorkspace.tickets.map((cells) => ({ cells, status: cells[5] === 'Offline' ? 'warning' : 'ok' }))}
        emptyAction="Créer ticket"
      />

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Clôture session POS"
          columns={[
            { label: 'Contrôle', sortable: true },
            { label: 'Valeur', sortable: true },
            { label: 'Revue', sortable: true },
            { label: 'Validation', sortable: true },
          ]}
          rows={posWorkspace.closeSession.map((cells) => ({ cells, status: cells[2].includes('Écart') ? 'warning' : 'ok' }))}
          emptyAction="Clôturer session"
        />
        <section className="uxPanel">
          <div className="uxPanelHeader">
            <div>
              <h2>Aperçu reçu et Z report</h2>
              <p>ICE, IF, RC, TVA, total par mode de paiement, remboursements et signature superviseur.</p>
            </div>
            <button type="button">Générer Z</button>
          </div>
          <div className="uxDocumentPreview">
            <strong>Z-2026-05-24-CASA</strong>
            <span>Espèces 12 330 MAD · Carte 8 900 MAD · Remboursements 620 MAD</span>
            <span className={statusClass('warning')}>Écart caisse -130 MAD à justifier avant journal</span>
          </div>
        </section>
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Remboursements autorisés"
          columns={[
            { label: 'Ticket source', sortable: true },
            { label: 'Ligne', sortable: true },
            { label: 'Motif', sortable: true },
            { label: 'Autorisation', sortable: true },
            { label: 'Impact', sortable: true },
          ]}
          rows={posWorkspace.refunds.map((cells) => ({ cells, status: 'warning' }))}
          emptyAction="Créer remboursement"
        />
        <DenseDataTable
          title="Offline sync review"
          columns={[
            { label: 'Terminal', sortable: true },
            { label: 'File', sortable: true },
            { label: 'Âge', sortable: true },
            { label: 'Conflit', sortable: true },
            { label: 'Action', sortable: true },
          ]}
          rows={posWorkspace.offline.map((cells) => ({ cells, status: cells[3].startsWith('0') ? 'ok' : 'danger' }))}
          emptyAction="Synchroniser"
        />
      </div>
    </main>
  );
}
