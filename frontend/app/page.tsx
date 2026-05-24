import { getDashboardSummary, getInvoices, getStock } from '../lib/api';

const formatMad = (value: number) =>
  new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value);

export default async function DashboardPage() {
  const [summary, invoices, stock] = await Promise.all([
    getDashboardSummary(),
    getInvoices(),
    getStock(),
  ]);

  const entity = summary.tenant.legalEntity;
  const modules = [
    ['Ventes', 'Devis, BL, factures, paiements'],
    ['Achats', 'Fournisseurs, receptions, CUMP'],
    ['Comptabilite', 'PCGE, journaux, periodes'],
    ['Paie', 'IR, CNSS, AMO, Damancom'],
    ['POS', 'Tickets, caisse, stock temps reel'],
    ['Production', 'OF, consommation, valorisation'],
  ];

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brandMark">ME</span>
          <div>
            <strong>Morocco ERP</strong>
            <small>SaaS entreprises</small>
          </div>
        </div>
        <nav>
          {['Tableau de bord', 'Ventes', 'Stock', 'Comptabilite', 'Paie', 'Conformite', 'Super-admin'].map((item) => (
            <a key={item} className={item === 'Tableau de bord' ? 'active' : ''}>{item}</a>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Workspace actif</p>
            <h1>{entity.tradeName}</h1>
            <p className="identity">
              ICE {entity.ice} · IF {entity.ifNumber} · RC {entity.rc} · Patente {entity.patente}
            </p>
          </div>
          <div className="status">
            <span>{summary.tenant.plan}</span>
            <strong>{summary.tenant.status}</strong>
          </div>
        </header>

        <section className="kpis">
          <Metric label="Chiffre facture" value={formatMad(summary.metrics.revenue)} />
          <Metric label="A encaisser" value={formatMad(summary.metrics.receivables)} />
          <Metric label="Valeur stock" value={formatMad(summary.metrics.stockValue)} />
          <Metric label="Factures" value={String(summary.metrics.invoices)} />
        </section>

        <section className="gridTwo">
          <div className="panel">
            <div className="panelHeader">
              <h2>Flux commercial</h2>
              <button>Nouveau devis</button>
            </div>
            <div className="workflow">
              {['Lead', 'Devis', 'Commande', 'BL', 'Facture', 'Paiement', 'Journal'].map((step, index) => (
                <span key={step} className={index < 2 ? 'done' : ''}>{step}</span>
              ))}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Facture</th>
                  <th>Statut</th>
                  <th>Total</th>
                  <th>Regle</th>
                </tr>
              </thead>
              <tbody>
                {(invoices.length ? invoices : [{ id: 'empty', number: 'Aucune facture', status: 'PRET', totals: { total: 0, subtotal: 0, vatTotal: 0 }, paidAmount: 0, customerId: '' }]).map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.number}</td>
                    <td><span className="pill">{invoice.status}</span></td>
                    <td>{formatMad(invoice.totals.total)}</td>
                    <td>{formatMad(invoice.paidAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panelHeader">
              <h2>Conformite Maroc</h2>
              <button>Exporter TVA</button>
            </div>
            <div className="compliance">
              <div><span>Rule pack</span><strong>{summary.compliance.id}</strong></div>
              <div><span>TVA</span><strong>{summary.compliance.vatRates.map((rate) => `${rate * 100}%`).join(' / ')}</strong></div>
              <div><span>Ville fiscale</span><strong>{entity.city}</strong></div>
            </div>
            <ul className="checks">
              {summary.compliance.invoiceMentions.slice(0, 6).map((mention) => (
                <li key={mention}>{mention}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="gridTwo">
          <div className="panel">
            <div className="panelHeader">
              <h2>Stock et CUMP</h2>
              <button>Reception</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Article</th>
                  <th>Qte</th>
                  <th>CUMP</th>
                  <th>Valeur</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((line) => (
                  <tr key={line.productId}>
                    <td>{line.sku}</td>
                    <td>{line.name}</td>
                    <td>{line.stockOnHand}</td>
                    <td>{formatMad(line.weightedAverageCost)}</td>
                    <td>{formatMad(line.stockValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panelHeader">
              <h2>Modules actifs</h2>
              <button>Parametres</button>
            </div>
            <div className="modules">
              {modules.map(([title, detail]) => (
                <div key={title} className="module">
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
