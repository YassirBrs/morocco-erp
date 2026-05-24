import { getAccountingSnapshot, getDashboardSummary, getInvoices, getPayrollSnapshot, getStock } from '../lib/api';

const formatMad = (value: number) =>
  new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value);

const statusLabels: Record<string, string> = {
  ACTIVE: 'Actif',
  DRAFT: 'Brouillon',
  POSTED: 'Comptabilisée',
  PAID: 'Payée',
  VOID: 'Annulée',
  PRET: 'Prêt',
};

const planLabels: Record<string, string> = {
  ENTERPRISE: 'Entreprise',
  PROFESSIONAL: 'Professionnel',
  STARTER: 'Démarrage',
};

const translate = (labels: Record<string, string>, value: string) => labels[value] ?? value;

export default async function DashboardPage() {
  const [summary, invoices, stock, accounting, payroll] = await Promise.all([
    getDashboardSummary(),
    getInvoices(),
    getStock(),
    getAccountingSnapshot(),
    getPayrollSnapshot(),
  ]);

  const entity = summary.tenant.legalEntity;
  const modules = [
    ['Ventes', 'Devis, BL, factures, paiements'],
    ['Achats', 'Fournisseurs, réceptions, CUMP'],
    ['Comptabilité', 'PCGE, journaux, périodes'],
    ['Paie', 'IR, CNSS, AMO, Damancom'],
    ['POS', 'Tickets, caisse, stock temps réel'],
    ['Production', 'OF, consommation, valorisation'],
  ];

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brandMark">ME</span>
          <div>
            <strong>Morocco ERP</strong>
            <small>SaaS pour entreprises marocaines</small>
          </div>
        </div>
        <nav>
          {['Tableau de bord', 'Ventes', 'Stock', 'Comptabilité', 'Paie', 'Conformité', 'Super-admin'].map((item) => (
            <a key={item} className={item === 'Tableau de bord' ? 'active' : ''}>{item}</a>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Espace actif</p>
            <h1>{entity.tradeName}</h1>
            <p className="identity">
              ICE {entity.ice} · IF {entity.ifNumber} · RC {entity.rc} · Patente {entity.patente}
            </p>
          </div>
          <div className="status">
            <span>{translate(planLabels, summary.tenant.plan)}</span>
            <strong>{translate(statusLabels, summary.tenant.status)}</strong>
          </div>
        </header>

        <section className="kpis">
          <Metric label="Chiffre facturé" value={formatMad(summary.metrics.revenue)} />
          <Metric label="À encaisser" value={formatMad(summary.metrics.receivables)} />
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
              {['Prospect', 'Devis', 'Commande', 'BL', 'Facture', 'Paiement', 'Journal'].map((step, index) => (
                <span key={step} className={index < 2 ? 'done' : ''}>{step}</span>
              ))}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Facture</th>
                  <th>Statut</th>
                  <th>Total</th>
                  <th>Réglé</th>
                </tr>
              </thead>
              <tbody>
                {(invoices.length ? invoices : [{ id: 'empty', number: 'Aucune facture', status: 'PRET', totals: { total: 0, subtotal: 0, vatTotal: 0 }, paidAmount: 0, customerId: '' }]).map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.number}</td>
                    <td><span className="pill">{translate(statusLabels, invoice.status)}</span></td>
                    <td>{formatMad(invoice.totals.total)}</td>
                    <td>{formatMad(invoice.paidAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panelHeader">
              <h2>Conformité Maroc</h2>
              <button>Exporter TVA</button>
            </div>
            <div className="compliance">
              <div><span>Règles Maroc</span><strong>{summary.compliance.id}</strong></div>
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
              <button>Réception</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Article</th>
                  <th>Qté</th>
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
              <button>Paramètres</button>
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

        <section className="gridTwo">
          <div className="panel">
            <div className="panelHeader">
              <h2>Comptabilité PCGE</h2>
              <button>Export comptable</button>
            </div>
            <div className="compliance">
              <div><span>Comptes</span><strong>{accounting.accounts.length}</strong></div>
              <div><span>Écritures</span><strong>{accounting.journalEntries.length}</strong></div>
              <div><span>TVA nette</span><strong>{formatMad(accounting.vatReport.netVatPayable)}</strong></div>
            </div>
          </div>

          <div className="panel">
            <div className="panelHeader">
              <h2>Paie Maroc</h2>
              <button>Damancom</button>
            </div>
            <div className="compliance">
              <div><span>Salariés</span><strong>{payroll.employees.filter((employee) => employee.active).length}</strong></div>
              <div><span>Contrats</span><strong>{payroll.contracts.filter((contract) => contract.active).length}</strong></div>
              <div><span>Runs paie</span><strong>{payroll.runs.length}</strong></div>
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
