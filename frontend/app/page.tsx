import {
  getAccountingSnapshot,
  getDashboardSummary,
  getDocumentOperations,
  getEnterpriseControlReadiness,
  getGovernanceReadiness,
  getGrowthControlReadiness,
  getInvoices,
  getIntegrationReadiness,
  getLogisticsCloseReadiness,
  getModuleData,
  getMoroccoWorkflowReadiness,
  getOperationalControlReadiness,
  getOperationalReports,
  getPlatformReadiness,
  getPayrollSnapshot,
  getRegulatedServiceReadiness,
  getSalesDashboard,
  getStock,
  searchBusiness,
} from '../lib/api';

const formatMad = (value: number) =>
  new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value);

const statusLabels: Record<string, string> = {
  ACTIVE: 'Actif',
  APPROVED: 'Approuvé',
  CLOSED: 'Clôturé',
  DRAFT: 'Brouillon',
  OPEN: 'Ouvert',
  PAID: 'Payée',
  POSTED: 'Comptabilisée',
  PRET: 'Prêt',
  REQUIRED: 'Approbation requise',
  VOID: 'Annulée',
};

const planLabels: Record<string, string> = {
  ENTERPRISE: 'Entreprise',
  INTILAQ: 'Intilaq',
  NUMOW: 'Numow',
  PROFESSIONAL: 'Professionnel',
  STARTER: 'Démarrage',
};

const translate = (labels: Record<string, string>, value: string) => labels[value] ?? value;

export default async function DashboardPage() {
  const [summary, invoices, stock, accounting, payroll, salesDashboard, documentOps, moduleData, commandResults, operationalReports, integrationReadiness, platformReadiness, moroccoWorkflows, governanceReadiness, operationalControls, enterpriseControls, growthControls, logisticsClose, regulatedServices] = await Promise.all([
    getDashboardSummary(),
    getInvoices(),
    getStock(),
    getAccountingSnapshot(),
    getPayrollSnapshot(),
    getSalesDashboard(),
    getDocumentOperations(),
    getModuleData(),
    searchBusiness('atlas'),
    getOperationalReports(),
    getIntegrationReadiness(),
    getPlatformReadiness(),
    getMoroccoWorkflowReadiness(),
    getGovernanceReadiness(),
    getOperationalControlReadiness(),
    getEnterpriseControlReadiness(),
    getGrowthControlReadiness(),
    getLogisticsCloseReadiness(),
    getRegulatedServiceReadiness(),
  ]);

  const entity = summary.tenant.legalEntity;
  const activeEmployees = payroll.employees.filter((employee) => employee.active);
  const activeModules = [
    ['Ventes', 'Liste, détail, création, édition devis/factures', moduleData.quotes.length],
    ['CRM', 'Clients, prospects, relances et recherche', moduleData.customers.length],
    ['Stock', 'Articles, dépôts, CUMP et exports', stock.length],
    ['Comptabilité', 'PCGE, écritures, périodes et TVA', accounting.journalEntries.length],
    ['Paie', 'Salariés, contrats, bulletins, Damancom', activeEmployees.length],
    ['POS', 'Sessions, tickets, remboursements, caisse', moduleData.posSessions.length],
  ];

  const states = [
    ['Chargement', 'Skeleton dense côté client pendant les appels API'],
    ['Vide', invoices.length ? 'Données présentes' : 'Aucune facture: action de création visible'],
    ['Erreur', 'Message rouge mappé aux erreurs backend'],
    ['Succès', 'Toast vert après création ou export'],
    ['Interdit', 'État 403 lecture seule ou abonnement verrouillé'],
  ];

  const validationMessages = [
    ['customerId', 'Le client est obligatoire'],
    ['lines[].productId', 'Article obligatoire sur chaque ligne'],
    ['lines[].quantity', 'La quantité doit être positive'],
    ['lines[].vatRate', 'Taux TVA marocain autorisé uniquement'],
    ['period.locked', 'La période fiscale est verrouillée'],
  ];

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brandMark">ME</span>
          <div>
            <strong>Morocco ERP</strong>
            <small>Application Next.js principale</small>
          </div>
        </div>
        <nav aria-label="Navigation principale">
          {[
            ['Tableau de bord', '/'],
            ['Ventes', '/ventes'],
            ['CRM', '/crm'],
            ['Stock', '/stock'],
            ['Comptabilité', '/comptabilite'],
            ['Paie', '/paie'],
            ['POS', '/pos'],
            ['Conformité', '/conformite'],
            ['Admin', '/admin'],
          ].map(([item, href]) => (
            <a key={item} className={item === 'Tableau de bord' ? 'active' : ''} href={href}>{item}</a>
          ))}
        </nav>
        <div className="personalization">
          <span>Personnalisation</span>
          <strong>{translate(planLabels, summary.tenant.plan)}</strong>
          <small>Navigation et widgets adaptés au rôle Direction / Plan tenant</small>
        </div>
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

        <section className="commandBar" aria-label="Recherche globale">
          <label htmlFor="globalCommand">Commande globale</label>
          <input id="globalCommand" defaultValue="atlas" aria-describedby="commandHelp" />
          <small id="commandHelp">Recherche clients, factures, articles, fournisseurs, salariés et écritures.</small>
          <div className="commandResults">
            {(commandResults.length ? commandResults : [{ id: 'empty', type: 'customers', title: 'Aucun résultat', subtitle: 'Essayez ICE, facture, article ou fournisseur' }]).map((item) => (
              <span key={item.id}>{item.type} · {item.title}</span>
            ))}
          </div>
        </section>

        <section className="kpis">
          <Metric label="Chiffre facturé" value={formatMad(summary.metrics.revenue)} />
          <Metric label="À encaisser" value={formatMad(summary.metrics.receivables)} />
          <Metric label="Valeur stock" value={formatMad(summary.metrics.stockValue)} />
          <Metric label="TVA ventes" value={formatMad(salesDashboard.totals.vat)} />
        </section>

        <section id="ventes" className="panel">
          <PanelHeader title="Ventes et reporting" action="Exporter CSV" />
          <div className="reportGrid">
            <Metric label="Période" value={salesDashboard.period} />
            <Metric label="Factures" value={String(salesDashboard.invoiceCount)} />
            <Metric label="Impayé" value={formatMad(salesDashboard.totals.unpaid)} />
            <Metric label="Avoirs" value={String(salesDashboard.creditNoteCount)} />
          </div>
          <DataTable
            columns={['Client', 'CA', 'Impayé', 'Factures']}
            rows={(salesDashboard.byCustomer.length ? salesDashboard.byCustomer : [{ customerName: 'Aucun client facturé', revenue: 0, unpaid: 0, invoices: 0 }]).map((row) => [
              row.customerName,
              formatMad(row.revenue),
              formatMad(row.unpaid),
              String(row.invoices),
            ])}
          />
          <div className="splitTables">
            <MiniList title="Par produit" rows={salesDashboard.byProduct.map((row) => `${row.sku} · ${formatMad(row.revenue)} · Qté ${row.quantity}`)} empty="Aucune vente produit" />
            <MiniList title="Par TVA" rows={salesDashboard.byVatRate.map((row) => `${Number(row.rate) * 100}% · HT ${formatMad(row.taxable)} · TVA ${formatMad(row.vat)}`)} empty="Aucune TVA collectée" />
            <MiniList title="Impayés" rows={salesDashboard.unpaidInvoices.map((row) => `${row.number} · ${row.customerName} · ${formatMad(row.unpaid)}`)} empty="Aucune facture impayée" />
          </div>
        </section>

        <section className="gridTwo">
          <div id="crm" className="panel">
            <PanelHeader title="CRM" action="Créer client" />
            <ModuleWorkflow title="Clients" records={moduleData.customers.map((customer) => `${customer.name} · ${customer.city ?? 'Maroc'} · ${translate(statusLabels, customer.active ? 'ACTIVE' : 'VOID')}`)} />
          </div>
          <div id="stock" className="panel">
            <PanelHeader title="Stock et CUMP" action="Exporter table" />
            <DataTable
              columns={['SKU', 'Article', 'Qté', 'CUMP', 'Valeur']}
              rows={stock.map((line) => [line.sku, line.name, String(line.stockOnHand), formatMad(line.weightedAverageCost), formatMad(line.stockValue)])}
            />
          </div>
        </section>

        <section className="gridTwo">
          <div id="comptabilite" className="panel">
            <PanelHeader title="Comptabilité PCGE" action="Nouvelle écriture" />
            <div className="reportGrid three">
              <Metric label="Comptes" value={String(accounting.accounts.length)} />
              <Metric label="Écritures" value={String(accounting.journalEntries.length)} />
              <Metric label="TVA nette" value={formatMad(accounting.vatReport.netVatPayable)} />
            </div>
            <KeyboardLines labels={['Compte', 'Libellé', 'Débit', 'Crédit']} />
          </div>
          <div id="paie" className="panel">
            <PanelHeader title="Paie Maroc" action="PDF bulletin" />
            <div className="reportGrid three">
              <Metric label="Salariés" value={String(activeEmployees.length)} />
              <Metric label="Contrats" value={String(payroll.contracts.filter((contract) => contract.active).length)} />
              <Metric label="Runs" value={String(payroll.runs.length)} />
            </div>
            <MiniList title="Salariés" rows={activeEmployees.map((employee) => `${employee.fullName} · ${formatMad(employee.baseSalary)}`)} empty="Aucun salarié actif" />
          </div>
        </section>

        <section className="gridTwo">
          <div id="pos" className="panel">
            <PanelHeader title="POS et caisse" action="Ouvrir session" />
            <ModuleWorkflow title="Sessions caisse" records={moduleData.posSessions.map((session) => `${session.number} · ${translate(statusLabels, session.status)} · attendu ${formatMad(session.expectedCash)} · écart ${formatMad(session.variance)}`)} />
          </div>
          <div id="conformite" className="panel">
            <PanelHeader title="Conformité Maroc" action="PDF facture" />
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

        <section id="admin" className="panel">
          <PanelHeader title="Documents, filtres et états UX" action="Exporter documents" />
          <div className="denseControls">
            <div>
              <h3>Numérotation</h3>
              {documentOps.numbering.settings.slice(0, 7).map((setting) => (
                <span key={setting.type}>{setting.type}: {setting.nextNumber}</span>
              ))}
            </div>
            <div>
              <h3>Modèles PDF</h3>
              {documentOps.templates.templates.slice(0, 5).map((template) => (
                <span key={template.id}>{template.name} · {template.language}</span>
              ))}
            </div>
            <div>
              <h3>Stockage fichiers</h3>
              <span>{documentOps.storage.activeProvider} · {documentOps.storage.files.length} fichier(s)</span>
              <span>Adaptateur objet production préparé</span>
            </div>
          </div>
          <div className="denseControls">
            <MiniList title="États standard" rows={states.map(([label, detail]) => `${label}: ${detail}`)} empty="-" />
            <MiniList title="Validation backend" rows={validationMessages.map(([field, message]) => `${field}: ${message}`)} empty="-" />
            <MiniList title="Filtres sauvegardés" rows={['Mes impayés', 'Stock sous seuil', 'Écritures brouillon', 'Paie à approuver', 'Colonnes: statut, total, TVA, propriétaire']} empty="-" />
          </div>
        </section>

        <section className="panel" aria-label="Rapports et intégrations">
          <PanelHeader title="Rapports et intégrations" action="Préparer exports" />
          <div className="reportGrid">
            <Metric label="Valorisation CUMP" value={formatMad(operationalReports.valuation.totals.value)} />
            <Metric label="Balance âgée clients" value={formatMad(operationalReports.aging.totals.receivables)} />
            <Metric label="Résultat net" value={formatMad(operationalReports.profitAndLoss.netIncome)} />
            <Metric label="Coût paie" value={formatMad(operationalReports.payrollCost.totals.employerCost)} />
          </div>
          <div className="denseControls">
            <MiniList title="Bilan et cohorte" rows={[
              `Actifs ${formatMad(operationalReports.balanceSheet.totals.assets)}`,
              `Passif + capitaux ${formatMad(operationalReports.balanceSheet.totals.liabilitiesAndEquity)}`,
              `Activation SaaS ${operationalReports.cohort.activationScore}%`,
            ]} empty="-" />
            <MiniList title="Adaptateurs Maroc" rows={[
              `DGI: ${integrationReadiness.dgi.operations.join(' / ')}`,
              `CNSS: ${integrationReadiness.cnss.operations.join(' / ')}`,
              'Banque CSV/OFX: prévisualisation et rapprochement',
              'Email: factures, relevés, bulletins, relances',
            ]} empty="-" />
            <MiniList title="Tests batch" rows={[
              `Scénarios seed: ${operationalReports.acceptance.scenarios.length}`,
              `Smoke Playwright: ${operationalReports.acceptance.smokeFlows.join(' > ')}`,
              `Webhooks/API keys: ${integrationReadiness.webhooks.length}/${integrationReadiness.apiKeys.length}`,
              'Rollback: ventes, stock, paie, périodes verrouillées',
            ]} empty="-" />
          </div>
        </section>

        <section className="panel" aria-label="Opérations SaaS et commercialisation">
          <PanelHeader title="Opérations SaaS et commercialisation" action="Gérer abonnement" />
          <div className="reportGrid">
            <Metric label="PostgreSQL" value={platformReadiness.persistence.provider} />
            <Metric label="Env production" value={platformReadiness.environment.status} />
            <Metric label="File jobs" value={String(platformReadiness.metrics.queueDepth)} />
            <Metric label="Facturation" value={platformReadiness.billing.writeLocked ? 'Verrouillée' : 'Active'} />
          </div>
          <div className="opsReadiness">
            <MiniList title="Migrations Prisma" rows={platformReadiness.persistence.migrationWorkflow} empty="Workflow absent" />
            <MiniList title="Observabilité" rows={[
              `Logs structurés ${platformReadiness.logs.length}`,
              `Erreurs API ${platformReadiness.metrics.apiErrorRatePercent}%`,
              `Échecs jobs ${platformReadiness.metrics.jobFailures}`,
              `Backup ${platformReadiness.backup.status}`,
            ]} empty="-" />
            <MiniList title="Staging et CI" rows={[
              `Staging ${platformReadiness.staging.status}`,
              `Admin protégé ${platformReadiness.staging.protectedAdminAccess ? 'oui' : 'non'}`,
              `Health checks ${platformReadiness.staging.healthChecks.join(' / ')}`,
            ]} empty="-" />
          </div>
          <div className="opsReadiness">
            <MiniList title="Plans tarifaires" rows={platformReadiness.pricing.map((plan) => `${plan.name} · ${formatMad(plan.monthlyMad)} · ${plan.modules.length} modules`)} empty="Aucun plan" />
            <MiniList title="Feature flags" rows={platformReadiness.flags.slice(0, 6).map((flag) => `${flag.key}: ${flag.enabled ? 'actif' : 'désactivé'} · ${flag.reason}`)} empty="Aucun flag" />
            <MiniList title="Upgrade prompts" rows={(platformReadiness.upgrades.prompts.length ? platformReadiness.upgrades.prompts : [{ module: 'tenant', reason: platformReadiness.upgrades.status, targetPlan: summary.tenant.plan }]).map((prompt) => `${prompt.module} · ${prompt.reason} · ${prompt.targetPlan}`)} empty="Aucun prompt" />
          </div>
          <div className="workspaceGrid" role="list" aria-label="Espaces de travail back-office">
            <WorkspaceTile title="Espace comptable" detail={`${platformReadiness.accountant.clients.length} client(s), revue TVA/paie/clôture`} />
            <WorkspaceTile title="Super-admin" detail={`${platformReadiness.superAdmin.tenants.length} tenant(s), règles ${platformReadiness.superAdmin.complianceRuleManagement.activeRulePack}`} />
            <WorkspaceTile title="Support diagnostics" detail={`${platformReadiness.support.recentAuditLogs.length} audits, ${platformReadiness.support.moduleUsage.length} modules suivis`} />
          </div>
        </section>

        <section className="panel" aria-label="Workflows Maroc avancés">
          <PanelHeader title="Workflows Maroc avancés" action="Ouvrir modules" />
          <div className="reportGrid">
            <Metric label="Réservations" value={String(moroccoWorkflows.reservations.rows.length)} />
            <Metric label="Villes livraison" value={String(moroccoWorkflows.deliveryRoutes.cities.length)} />
            <Metric label="Modes paiement" value={String(moroccoWorkflows.paymentMethods.rows.length)} />
            <Metric label="Préflight CNSS" value={moroccoWorkflows.damancomPreflight.status} />
          </div>
          <div className="opsReadiness">
            <MiniList title="Trésorerie" rows={[
              `Chèques suivis ${moroccoWorkflows.cheques.length}`,
              `Remises banque ${moroccoWorkflows.depositBatches.length}`,
              `Transferts caisse ${moroccoWorkflows.cashboxTransfers.length}`,
              'Espèces, banque, chèque, carte, mobile money',
            ]} empty="-" />
            <MiniList title="RH et paie" rows={[
              `Documents salariés ${moroccoWorkflows.employeeDocuments.length}`,
              `Rappels contrats/probation ${moroccoWorkflows.contractReminders.length}`,
              `Congés calendrier ${moroccoWorkflows.leaveCalendar.rows.length}`,
              `Archives paie ${moroccoWorkflows.payrollExports.length}`,
            ]} empty="-" />
            <MiniList title="Achats" rows={[
              `Demandes achat ${moroccoWorkflows.purchaseRequests.length}`,
              'Comparaison fournisseurs: prix, délai, risque, préféré',
              'Relevés fournisseurs avec achats, paiements, soldes',
              'Emails devis/factures avec mentions légales',
            ]} empty="-" />
          </div>
        </section>

        <section className="panel" aria-label="Gouvernance et pilotage">
          <PanelHeader title="Gouvernance et pilotage" action="Préparer dossier" />
          <div className="reportGrid">
            <Metric label="Anomalies comptables" value={governanceReadiness.anomalyChecks.status} />
            <Metric label="Numérotation" value={governanceReadiness.numberingAudit.status} />
            <Metric label="Onboarding" value={`${governanceReadiness.onboarding.progressPercent}%`} />
            <Metric label="Régions Maroc" value={String(governanceReadiness.regions.length)} />
          </div>
          <div className="opsReadiness">
            <MiniList title="Audit et preuves" rows={[
              `Mouvements stock ${governanceReadiness.movementAudit.rows.length}`,
              `Dossier export ${governanceReadiness.exportManifest.files.length} fichier(s)`,
              `Binder comptable ${governanceReadiness.evidenceBinder.sections.join(' / ')}`,
              `Centre exports filtres ${governanceReadiness.exportCenter.filters.join(', ')}`,
            ]} empty="-" />
            <MiniList title="Sécurité et intégrations" rows={[
              `Invitations ${governanceReadiness.invitations.length}`,
              `Rate limiting ${governanceReadiness.rateLimits.status}`,
              `Retries webhooks ${governanceReadiness.webhookRetries.length}`,
              'Révocation sessions admin prête',
            ]} empty="-" />
            <MiniList title="Pilotage risques" rows={[
              `Alertes péremption ${governanceReadiness.expiryAlerts.length}`,
              `File comptable ${governanceReadiness.accountantQueue.rows.length}`,
              `KPI variance ${governanceReadiness.kpiVariance.length}`,
              `Risque client ${governanceReadiness.customerRisk.map((risk) => `${risk.customerName}: ${risk.level}`).join(' / ') || 'bas'}`,
            ]} empty="-" />
          </div>
        </section>

        <section className="panel" aria-label="Pilotage opérationnel avancé">
          <PanelHeader title="Pilotage opérationnel avancé" action="Contrôler flux" />
          <div className="reportGrid">
            <Metric label="Fiabilité fournisseurs" value={String(operationalControls.supplierReliability.length)} />
            <Metric label="Cycle articles" value={String(operationalControls.lifecycleBoard.rows.length)} />
            <Metric label="TVA exceptions" value={String(operationalControls.vatExceptions.count)} />
            <Metric label="CNSS anomalies" value={String(operationalControls.cnssAnomalies.count)} />
          </div>
          <div className="opsReadiness">
            <MiniList title="Stock et livraison" rows={[
              `Quarantaines ${operationalControls.quarantines.length}`,
              `Preuves livraison ${operationalControls.deliveryProofs.length}`,
              'Réservations expirées avec libération automatique',
              'États article: brouillon, actif, bloqué, discontinué, archivé',
            ]} empty="-" />
            <MiniList title="Contrats et pricing" rows={[
              `Contrats clients ${operationalControls.customerContracts.length}`,
              `Contrats fournisseurs ${operationalControls.supplierContracts.length}`,
              `Règles tarifaires ${operationalControls.pricingRules.length}`,
              `Approbations remises ${operationalControls.discountApprovals.length}`,
            ]} empty="-" />
            <MiniList title="Finance et RH" rows={[
              `Factures récurrentes ${operationalControls.recurringInvoices.length}`,
              `Achats récurrents ${operationalControls.recurringPurchases.length}`,
              `Notes de frais ${operationalControls.expenseClaims.length}`,
              `Petite caisse ${operationalControls.pettyCash.length}`,
              `Matching bancaire ${operationalControls.bankMatching.rows.length}`,
              `Checklists RH ${operationalControls.employeeChecklists.length}`,
            ]} empty="-" />
          </div>
        </section>

        <section className="panel" aria-label="Contrôles entreprise étendus">
          <PanelHeader title="Contrôles entreprise étendus" action="Valider go-live" />
          <div className="reportGrid">
            <Metric label="Agences" value={String(enterpriseControls.branches.rows.length)} />
            <Metric label="Localisation" value={enterpriseControls.localization.mainLanguage} />
            <Metric label="Intégrations" value={String(enterpriseControls.integrationHealth.rows.length)} />
            <Metric label="Archive vérifiée" value={enterpriseControls.exportTamperEvidence.tamperEvidence ? 'Oui' : 'Non'} />
          </div>
          <div className="opsReadiness">
            <MiniList title="RH, actifs et flotte" rows={[
              `Notes RH privées ${enterpriseControls.hrNotes.length}`,
              `Affectations actifs ${enterpriseControls.assetAssignments.length}`,
              `Efficacité flotte ${enterpriseControls.fleetEfficiency.rows.length}`,
              `Maintenance préventive ${enterpriseControls.preventiveMaintenance.length}`,
            ]} empty="-" />
            <MiniList title="Production, projets, achats" rows={[
              `WIP projets ${enterpriseControls.projectWip.rows.length}`,
              `Écarts production ${enterpriseControls.productionVariance.rows.length}`,
              `Budgets achats ${enterpriseControls.procurementBudgets.rows.length}`,
              `Aperçu modèle ${enterpriseControls.templatePreview.status}`,
            ]} empty="-" />
            <MiniList title="Portails et conformité" rows={[
              `Emails audit ${enterpriseControls.emailAudit.length}`,
              `Portail client ${enterpriseControls.customerPortal.paymentStatus ?? 'prêt'}`,
              `Portail fournisseur ${enterpriseControls.supplierPortal.paymentStatus ?? 'prêt'}`,
              `Revues comptables ${enterpriseControls.accountantReviews.length}`,
              `Checklist partenaire ${enterpriseControls.partnerChecklist.tenantHealth}`,
              `Rollout règles ${enterpriseControls.ruleRollout.status}`,
              `Audit flags ${enterpriseControls.featureFlagAudit.length}`,
              `Signature webhooks replay ${enterpriseControls.webhookSignature.replayProtected ? 'protégé' : 'à revoir'}`,
            ]} empty="-" />
          </div>
        </section>

        <section className="panel" aria-label="Accélération croissance et recouvrement">
          <PanelHeader title="Accélération croissance et recouvrement" action="Piloter risques" />
          <div className="reportGrid">
            <Metric label="Score compétitif" value={String(growthControls.competitiveScorecard.scores.total)} />
            <Metric label="SLA dépassés" value={String(growthControls.slaTimers.breached)} />
            <Metric label="KYC client" value={growthControls.customerKyc.status} />
            <Metric label="KYS fournisseur" value={growthControls.supplierKys.status} />
          </div>
          <div className="opsReadiness">
            <MiniList title="Support, release, onboarding" rows={[
              `Restore tenant ${growthControls.restoreChecklist.status}`,
              `Impersonations support ${growthControls.supportImpersonations.length}`,
              `Release notes ciblées ${growthControls.releaseNotes.length}`,
              `Nudges adoption ${growthControls.onboardingNudges.rows.length}`,
              `Concurrents suivis ${growthControls.competitiveScorecard.competitors.join(', ')}`,
            ]} empty="-" />
            <MiniList title="SLA, FX et agences" rows={[
              `Timers workflow ${growthControls.slaTimers.rows.length}`,
              `Règles escalade ${growthControls.escalationRules.length}`,
              `Préparations devises ${growthControls.currencyPreparations.length}`,
              `Numérotation agence ${growthControls.branchNumberingPolicies.length}`,
              `Heatmap régions ${growthControls.regionalSalesHeatmap.rows.length}`,
            ]} empty="-" />
            <MiniList title="Litiges et paiements" rows={[
              `Litiges clients ${growthControls.customerDisputes.length}`,
              `Litiges fournisseurs ${growthControls.supplierDisputes.length}`,
              `Promesses paiement ${growthControls.promisesToPay.length}`,
              `Allocations paiement ${growthControls.paymentAllocationPreview.rows.length}`,
              `Relances FR ${growthControls.dunningPolicies.length}`,
              `Propositions fournisseurs ${growthControls.supplierPaymentProposal.proposals.length}`,
              `Audit chèques ${growthControls.chequeLifecycle.rows.length}`,
              `Frais banque/RAS ${growthControls.paymentAdjustments.length}`,
            ]} empty="-" />
          </div>
        </section>

        <section className="panel" aria-label="Logistique clôture et paie">
          <PanelHeader title="Logistique clôture et paie" action="Pré-clôturer" />
          <div className="reportGrid">
            <Metric label="Réservations âgées" value={String(logisticsClose.reservationAging.rows.length)} />
            <Metric label="Exceptions BL/facture" value={logisticsClose.deliveryInvoiceExceptions.status} />
            <Metric label="Calendrier fiscal" value={String(logisticsClose.taxCalendar.rows.length)} />
            <Metric label="Social paie" value={logisticsClose.socialReconciliation.status} />
          </div>
          <div className="opsReadiness">
            <MiniList title="Stock et transport" rows={[
              `Instructions livraison ${logisticsClose.deliveryInstructions.length}`,
              `Transporteurs ${logisticsClose.transporters.rows.length}`,
              `Historique prix fournisseurs ${logisticsClose.supplierPriceHistory.rows.length}`,
              `Substituts stockout ${logisticsClose.substituteRecommendations.rows.length}`,
              `Stock dormant ${logisticsClose.deadStock.rows.length}`,
              `CUMP rehearsal ${logisticsClose.cumpRehearsal.rows.length}`,
            ]} empty="-" />
            <MiniList title="Clôture comptable" rows={[
              `Matrices achats ${logisticsClose.procurementMatrices.length}`,
              `Exigences pièces ${logisticsClose.attachmentRequirements.length}`,
              `Accruals pré-clôture ${logisticsClose.accruals.rows.length}`,
              `Owners conformité ${logisticsClose.complianceOwners.rows.length}`,
            ]} empty="-" />
            <MiniList title="Paie et projets" rows={[
              `Prêts salariés ${logisticsClose.payrollLoans.length}`,
              `Audit RH ${logisticsClose.hrAuditTrail.length}`,
              `Plans facturation projet ${logisticsClose.projectBillingPlans.length}`,
              'Avenants, overtime et remboursements reliés aux journaux',
            ]} empty="-" />
          </div>
        </section>

        <section className="panel" aria-label="Contrôles réglementaires et service client">
          <PanelHeader title="Contrôles réglementaires et service client" action="Valider conformité" />
          <div className="reportGrid">
            <Metric label="Contrats service" value={String(regulatedServices.serviceContracts.length)} />
            <Metric label="Score qualité données" value={`${regulatedServices.dataQuality.score}%`} />
            <Metric label="Prorata TVA" value={formatMad(regulatedServices.vatProrata.deductibleVat)} />
            <Metric label="Anomalies CNSS" value={String(regulatedServices.cnssAnomalies.count)} />
          </div>
          <div className="opsReadiness">
            <MiniList title="Service client et opérations" rows={[
              `Factures brouillon contrats ${regulatedServices.draftInvoices.count}`,
              `Renouvellements ${regulatedServices.renewalReminders.dueSoon}`,
              `Dossiers SAV ${regulatedServices.warrantyCases.length}`,
              `Contrôles qualité production ${regulatedServices.qualityChecks.length}`,
              `Pièces maintenance ${regulatedServices.spareParts.length}`,
              `Dossiers flotte ${regulatedServices.fleetCases.length}`,
            ]} empty="-" />
            <MiniList title="Admin SaaS et support" rows={[
              `Délégations approbation ${regulatedServices.approvalDelegations.length}`,
              `Clés API granulaires ${regulatedServices.apiKeys.length}`,
              `Sandbox import ${regulatedServices.importSandbox.length}`,
              `Centre exports filtres ${regulatedServices.exportCenter.filters.join(', ')}`,
              `Tickets support ${regulatedServices.supportTickets.length}`,
              `Santé files ${regulatedServices.adminHealth.queues.status}`,
              `Runbook archive ${regulatedServices.resilience.legalArchive}`,
            ]} empty="-" />
            <MiniList title="Fiscal Maroc" rows={[
              `Pack comptable ${regulatedServices.accountantHandoff.checksum.slice(0, 10) || 'à générer'}`,
              `Charge partenaire ${regulatedServices.partnerWorkload.totals.workloadHours}h`,
              `IS estimé ${formatMad(regulatedServices.isEstimate.estimatedIs)}`,
              `Taxe professionnelle ${regulatedServices.professionalTax.length}`,
              `Calendrier DGI preuves manquantes ${regulatedServices.dgiCalendar.missingEvidence}`,
              `CNSS affiliation manquante ${regulatedServices.cnssAnomalies.summary.missingAffiliation ?? 0}`,
            ]} empty="-" />
          </div>
        </section>

        <section className="panel">
          <PanelHeader title="Écrans par module" action="Mode tablette" />
          <div className="modules">
            {activeModules.map(([title, detail, count]) => (
              <div key={title} className="module">
                <strong>{title}</strong>
                <span>{detail}</span>
                <small>{count} enregistrement(s) · liste / détail / créer / modifier</small>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function PanelHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="panelHeader">
      <h2>{title}</h2>
      <button type="button">{action}</button>
    </div>
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

function DataTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="tableScroll">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, index) => (
            <tr key={`${row.join('-')}-${index}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>
          )) : (
            <tr><td colSpan={columns.length}>Aucune donnée disponible</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MiniList({ title, rows, empty }: { title: string; rows: string[]; empty: string }) {
  return (
    <div className="miniList">
      <h3>{title}</h3>
      {(rows.length ? rows : [empty]).map((row) => <span key={row}>{row}</span>)}
    </div>
  );
}

function ModuleWorkflow({ title, records }: { title: string; records: string[] }) {
  return (
    <>
      <div className="workflow">
        {['Liste', 'Détail', 'Créer', 'Modifier', 'Valider', 'Exporter'].map((step, index) => (
          <span key={step} className={index < 4 ? 'done' : ''}>{step}</span>
        ))}
      </div>
      <MiniList title={title} rows={records} empty="Aucun enregistrement, action de création disponible" />
    </>
  );
}

function WorkspaceTile({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="workspaceTile" role="listitem">
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}

function KeyboardLines({ labels }: { labels: string[] }) {
  return (
    <div className="keyboardGrid" aria-label="Saisie clavier lignes">
      {labels.map((label, index) => (
        <label key={label}>
          <span>{label}</span>
          <input tabIndex={index + 1} placeholder={label} />
        </label>
      ))}
    </div>
  );
}
