export type EnterpriseExpansionFeatureKey =
  | 'supplierProfitabilityRisk'
  | 'onboardingWizard'
  | 'trainingChecklist'
  | 'tenantSuccess'
  | 'migrationRoi'
  | 'cashflowStress'
  | 'accountantTimeline'
  | 'creditCommittee'
  | 'supplierRenewal'
  | 'branchTransferImpact'
  | 'hospitalityServiceCharge'
  | 'loyaltyLiability'
  | 'educationBilling'
  | 'clinicInvoicing'
  | 'constructionProgress'
  | 'landedCostVariance'
  | 'exporterCurrencyPack'
  | 'agriPurchaseIntake'
  | 'scrapRecovery'
  | 'retainerRevenue'
  | 'downgradeRisk'
  | 'legalIdentityChange'
  | 'dataResidency'
  | 'incidentResponse'
  | 'releaseReadiness'
  | 'aiBookkeeping'
  | 'ocrBenchmark'
  | 'bankFeedConsent'
  | 'eInvoicingGaps'
  | 'payrollRuleDiff'
  | 'vatAuditTrail'
  | 'fixedAssetDepreciation'
  | 'leasingTracker'
  | 'insuranceRegister'
  | 'pettyCashReplenishment'
  | 'corporateCardImport'
  | 'travelMission'
  | 'slaPenalty'
  | 'supplierRebate'
  | 'reservationExpiry';

export type EnterpriseExpansionMetric = {
  label: string;
  path: string;
  format?: 'money' | 'count' | 'boolean';
};

export type EnterpriseExpansionFeatureDefinition = {
  key: EnterpriseExpansionFeatureKey;
  title: string;
  domain: string;
  route: string;
  description: string;
  metrics: EnterpriseExpansionMetric[];
  controls: string[];
};

export const enterpriseExpansionFeatureDefinitions: EnterpriseExpansionFeatureDefinition[] = [
  { key: 'supplierProfitabilityRisk', title: 'Risque profitabilité fournisseur', domain: 'Achats', route: '/enterprise-expansion/supplier-profitability-risk-report-page', description: 'Rapport fournisseur par volume, litiges, délai, variance prix et documents.', metrics: [{ label: 'Lignes', path: 'rows', format: 'count' }, { label: 'Volume', path: 'rows.0.purchaseVolume', format: 'money' }, { label: 'Statut', path: 'status' }], controls: ['Volume achats', 'Litiges', 'Délai', 'Documents'] },
  { key: 'onboardingWizard', title: 'Wizard onboarding SaaS', domain: 'SaaS', route: '/enterprise-expansion/saas-onboarding-wizard-state-page', description: 'État persistant onboarding avec étapes, owner, deadline et escalade blockers.', metrics: [{ label: 'Étapes', path: 'completedSteps', format: 'count' }, { label: 'Blockers', path: 'blockers', format: 'count' }, { label: 'Persisté', path: 'persisted', format: 'boolean' }], controls: ['Étapes', 'Owner', 'Deadline', 'Escalade'] },
  { key: 'trainingChecklist', title: 'Checklist formation rôles', domain: 'SaaS', route: '/enterprise-expansion/role-training-checklist-page', description: 'Checklist par rôle avec leçons, échecs, adoption module et nudges support.', metrics: [{ label: 'Rôles', path: 'rows', format: 'count' }, { label: 'Leçons', path: 'rows.0.completedLessons', format: 'count' }, { label: 'Statut', path: 'status' }], controls: ['Leçons', 'Échecs', 'Adoption', 'Support'] },
  { key: 'tenantSuccess', title: 'Score succès tenant', domain: 'SaaS', route: '/enterprise-expansion/tenant-success-score-page', description: 'Score tenant combinant activation, qualité data, conformité, SLA support et paiement.', metrics: [{ label: 'Score', path: 'score' }, { label: 'Data', path: 'dataQuality' }, { label: 'Statut', path: 'status' }], controls: ['Activation', 'Qualité', 'Conformité', 'Paiement'] },
  { key: 'migrationRoi', title: 'ROI migration concurrent', domain: 'Stratégie', route: '/enterprise-expansion/competitor-migration-roi-calculator-page', description: 'Calcul ROI migration comparant coût licence, temps implémentation, gaps et conformité locale.', metrics: [{ label: 'Comparatifs', path: 'rows', format: 'count' }, { label: 'Premier ROI', path: 'rows.0.roiMonths' }, { label: 'Plan', path: 'tenantPlan' }], controls: ['Licence', 'Temps', 'Gaps', 'Conformité'] },
  { key: 'cashflowStress', title: 'Stress test cashflow PME', domain: 'Finance', route: '/enterprise-expansion/moroccan-sme-cashflow-stress-test-page', description: 'Stress test trésorerie par échéance TVA, paie, aging fournisseur et solde banque.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Stress', path: 'stressedBalance', format: 'money' }, { label: 'Aging', path: 'supplierAging', format: 'money' }], controls: ['TVA', 'Paie', 'Aging', 'Banque'] },
  { key: 'accountantTimeline', title: 'Timeline expert-comptable', domain: 'Cabinet', route: '/enterprise-expansion/certified-accountant-collaboration-timeline-page', description: 'Timeline collaboration expert-comptable avec demandes, réponses, blockers et sign-off.', metrics: [{ label: 'Événements', path: 'rows', format: 'count' }, { label: 'Blockers', path: 'blockers', format: 'count' }, { label: 'Sign-off', path: 'signOffTrail', format: 'count' }], controls: ['Demandes', 'Réponses', 'Blockers', 'Visa'] },
  { key: 'creditCommittee', title: 'Pack comité crédit client', domain: 'CRM', route: '/enterprise-expansion/customer-credit-committee-pack-page', description: 'Pack crédit client avec exposition, garanties, historique paiement, litiges et limite proposée.', metrics: [{ label: 'Exposition', path: 'exposure', format: 'money' }, { label: 'Litiges', path: 'litigation' }, { label: 'Décision', path: 'decision' }], controls: ['Exposition', 'Garanties', 'Paiements', 'Limite'] },
  { key: 'supplierRenewal', title: 'Scorecard renouvellement fournisseur', domain: 'Achats', route: '/enterprise-expansion/supplier-renewal-scorecard-page', description: 'Renouvellement fournisseur par documents, prix, SLA livraison, litiges et conditions négociées.', metrics: [{ label: 'Documents', path: 'documents', format: 'count' }, { label: 'Litiges', path: 'disputes' }, { label: 'Décision', path: 'renewalDecision' }], controls: ['Documents', 'Prix', 'SLA', 'Termes'] },
  { key: 'branchTransferImpact', title: 'Impact transfert agence', domain: 'Branches', route: '/enterprise-expansion/branch-stock-transfer-profitability-page', description: 'Impact profitabilité transfert stock par fret, shrinkage, marge destination et approbation.', metrics: [{ label: 'Marge', path: 'destinationMargin', format: 'money' }, { label: 'Fret', path: 'freight', format: 'money' }, { label: 'Statut', path: 'status' }], controls: ['Fret', 'Shrinkage', 'Marge', 'Approbation'] },
  { key: 'hospitalityServiceCharge', title: 'Service charge hospitality', domain: 'POS', route: '/enterprise-expansion/hospitality-pos-service-charge-page', description: 'Service charge restaurant/hospitality avec TVA, clôture caisse et proposition pourboires.', metrics: [{ label: 'Service', path: 'serviceCharge', format: 'money' }, { label: 'Statut', path: 'status' }, { label: 'Caisse', path: 'cashierCloseStatus' }], controls: ['Service charge', 'TVA', 'Clôture', 'Pourboires'] },
  { key: 'loyaltyLiability', title: 'Ledger fidélité retail', domain: 'Retail', route: '/enterprise-expansion/retail-loyalty-liability-ledger-page', description: 'Ledger points fidélité avec points acquis, utilisés, expiration et provision.', metrics: [{ label: 'Acquis', path: 'earnedPoints' }, { label: 'Utilisés', path: 'redeemedPoints' }, { label: 'Provision', path: 'liability', format: 'money' }], controls: ['Points acquis', 'Rédemption', 'Expiration', 'Provision'] },
  { key: 'educationBilling', title: 'Cycle facturation école', domain: 'Éducation', route: '/enterprise-expansion/private-education-billing-cycle-page', description: 'Facturation enseignement privé avec inscription, mensualités, remises et promesses parent.', metrics: [{ label: 'Inscription', path: 'registrationFee', format: 'money' }, { label: 'Factures', path: 'monthlyInvoices', format: 'count' }, { label: 'Promesses', path: 'parentPortalPromises', format: 'count' }], controls: ['Inscription', 'Mensualités', 'Remises', 'Portail parent'] },
  { key: 'clinicInvoicing', title: 'Facturation clinique', domain: 'Santé', route: '/enterprise-expansion/clinic-service-invoicing-compliance-page', description: 'Facturation clinique avec praticien, acte, part assurance, part patient et archive.', metrics: [{ label: 'Patient', path: 'patientShare', format: 'money' }, { label: 'Assurance', path: 'insuranceShare', format: 'money' }, { label: 'Statut', path: 'status' }], controls: ['Praticien', 'Acte', 'Assurance', 'Archive'] },
  { key: 'constructionProgress', title: 'Certificat avancement BTP', domain: 'BTP', route: '/enterprise-expansion/construction-progress-billing-certificate-page', description: 'Certificat avancement BTP avec ligne BOQ, retenue, taxe et approbation client.', metrics: [{ label: 'Avancement', path: 'progressPercent' }, { label: 'Retenue', path: 'retention', format: 'money' }, { label: 'Client', path: 'customerApproval' }], controls: ['BOQ', 'Retenue', 'Taxe', 'Client'] },
  { key: 'landedCostVariance', title: 'Variance landed cost import', domain: 'Import', route: '/enterprise-expansion/importer-landed-cost-variance-page', description: 'Analyse variance landed cost par DUM, change, transit et delta valorisation stock.', metrics: [{ label: 'Delta', path: 'stockValuationDelta', format: 'money' }, { label: 'Change', path: 'exchangeRate' }, { label: 'Statut', path: 'varianceStatus' }], controls: ['DUM', 'Change', 'Transit', 'Stock'] },
  { key: 'exporterCurrencyPack', title: 'Pack facture export devise', domain: 'Export', route: '/enterprise-expansion/exporter-foreign-currency-invoice-pack-page', description: 'Pack facture export devise avec change, preuve douane, exonération TVA et rapatriement.', metrics: [{ label: 'Devise', path: 'currency' }, { label: 'Change', path: 'exchangeRate' }, { label: 'Rapatriement', path: 'bankRepatriation' }], controls: ['Devise', 'Douane', 'TVA', 'Banque'] },
  { key: 'agriPurchaseIntake', title: 'Réception achat agri', domain: 'Agriculture', route: '/enterprise-expansion/cooperative-agri-purchase-intake-page', description: 'Réception coopérative/agri avec identité producteur, pesée, qualité et retenue.', metrics: [{ label: 'Grade', path: 'qualityGrade' }, { label: 'Net kg', path: 'weighing.netKg' }, { label: 'Statut', path: 'status' }], controls: ['Producteur', 'Pesée', 'Qualité', 'Retenue'] },
  { key: 'scrapRecovery', title: 'Recovery coût scrap', domain: 'Production', route: '/enterprise-expansion/manufacturing-scrap-cost-recovery-page', description: 'Recovery coût rebut avec cause, centre responsable, rework et proposition comptable.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Rework', path: 'rework.cost', format: 'money' }, { label: 'Écritures', path: 'accountingRecoveryProposal', format: 'count' }], controls: ['Cause', 'Centre', 'Rework', 'Compta'] },
  { key: 'retainerRevenue', title: 'Reconnaissance retainer', domain: 'Services', route: '/enterprise-expansion/service-retainer-revenue-recognition-page', description: 'Reconnaissance revenu retainer avec contrat, heures consommées, revenu différé et facture.', metrics: [{ label: 'Heures', path: 'consumedHours' }, { label: 'Différé', path: 'deferredRevenue', format: 'money' }, { label: 'Trigger', path: 'invoiceTrigger' }], controls: ['Contrat', 'Heures', 'Différé', 'Facture'] },
  { key: 'downgradeRisk', title: 'Simulateur downgrade plan', domain: 'SaaS', route: '/enterprise-expansion/saas-plan-downgrade-risk-simulator-page', description: 'Risque downgrade SaaS avec modules bloqués, limites données, exports et communication client.', metrics: [{ label: 'Plan cible', path: 'targetPlan' }, { label: 'Locks', path: 'moduleLocks', format: 'count' }, { label: 'Statut', path: 'status' }], controls: ['Modules', 'Limites', 'Exports', 'Communication'] },
  { key: 'legalIdentityChange', title: 'Changement identité légale', domain: 'Conformité', route: '/enterprise-expansion/tenant-legal-identity-change-page', description: 'Workflow identité légale avec RC/ICE/IF, approbation, protection factures et audit.', metrics: [{ label: 'Protection', path: 'historicalInvoiceProtection', format: 'boolean' }, { label: 'Audit', path: 'auditTrail' }, { label: 'Approbation', path: 'approval' }], controls: ['RC', 'ICE', 'IF', 'Factures'] },
  { key: 'dataResidency', title: 'Checklist résidence data', domain: 'Sécurité', route: '/enterprise-expansion/data-residency-checklist-page', description: 'Checklist résidence données Maroc avec région, backups, logs et registre sous-traitants.', metrics: [{ label: 'Checks', path: 'checks', format: 'count' }, { label: 'Logs', path: 'accessLogs' }, { label: 'Région', path: 'storageRegion' }], controls: ['Région', 'Backups', 'Logs', 'Sous-traitants'] },
  { key: 'incidentResponse', title: 'Rapport incident', domain: 'Sécurité', route: '/enterprise-expansion/incident-response-report-builder-page', description: 'Builder rapport incident avec impact, timeline, tenants affectés, remédiation et notices.', metrics: [{ label: 'Impact', path: 'impact' }, { label: 'Timeline', path: 'timeline', format: 'count' }, { label: 'Statut', path: 'status' }], controls: ['Impact', 'Timeline', 'Remédiation', 'Notices'] },
  { key: 'releaseReadiness', title: 'Gate release readiness', domain: 'DevOps', route: '/enterprise-expansion/release-readiness-gate-page', description: 'Gate release avec migrations, tests, rollback, support notes et changements clients.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Backend', path: 'tests.backend' }, { label: 'Frontend', path: 'tests.frontend' }], controls: ['Migrations', 'Tests', 'Rollback', 'Support'] },
  { key: 'aiBookkeeping', title: 'Queue AI bookkeeping', domain: 'Comptabilité', route: '/enterprise-expansion/ai-bookkeeping-suggestion-queue-page', description: 'Queue suggestions comptables IA avec source, journal, confiance, décision et audit.', metrics: [{ label: 'Suggestions', path: 'rows', format: 'count' }, { label: 'Confiance', path: 'rows.0.confidence' }, { label: 'Statut', path: 'status' }], controls: ['Source', 'Journal', 'Confiance', 'Audit'] },
  { key: 'ocrBenchmark', title: 'Benchmark OCR vendors', domain: 'Documents', route: '/enterprise-expansion/ocr-vendor-benchmark-dashboard-page', description: 'Benchmark OCR avec précision, coût, latence, support arabe/français et fallback.', metrics: [{ label: 'Vendors', path: 'rows', format: 'count' }, { label: 'Précision', path: 'rows.0.accuracy' }, { label: 'Statut', path: 'status' }], controls: ['Précision', 'Coût', 'Latence', 'Langues'] },
  { key: 'bankFeedConsent', title: 'Consentement bank feed', domain: 'Banque', route: '/enterprise-expansion/bank-feed-consent-lifecycle-page', description: 'Cycle consentement bank feed avec mandat, expiration, refresh, révocation et archive.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Expiration', path: 'expiration' }, { label: 'Révoqué', path: 'revokedState', format: 'boolean' }], controls: ['Mandat', 'Expiration', 'Refresh', 'Archive'] },
  { key: 'eInvoicingGaps', title: 'Gaps e-invoicing', domain: 'Conformité', route: '/enterprise-expansion/e-invoicing-readiness-gap-tracker-page', description: 'Tracker readiness e-invoicing avec mentions, signature, archivage, numérotation et adapter.', metrics: [{ label: 'Gaps', path: 'gaps', format: 'count' }, { label: 'Score', path: 'readinessScore' }, { label: 'Statut', path: 'status' }], controls: ['Mentions', 'Signature', 'Archive', 'Adapter'] },
  { key: 'payrollRuleDiff', title: 'Diff rule pack paie', domain: 'Paie', route: '/enterprise-expansion/payroll-rule-pack-version-diff-page', description: 'Diff règles paie CNSS/AMO/IR avec ancienne/nouvelle version et salariés impactés.', metrics: [{ label: 'Date', path: 'effectiveDate' }, { label: 'Salariés', path: 'impactedEmployees', format: 'count' }, { label: 'Statut', path: 'status' }], controls: ['CNSS', 'AMO', 'IR', 'Impact'] },
  { key: 'vatAuditTrail', title: 'Explorateur trace TVA', domain: 'Fiscalité', route: '/enterprise-expansion/vat-audit-trail-explorer-page', description: 'Trace TVA de ligne facture à déclaration, paiement, archive et note comptable.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Paiement', path: 'paymentId' }, { label: 'Note', path: 'accountantNoteId' }], controls: ['Facture', 'Déclaration', 'Paiement', 'Archive'] },
  { key: 'fixedAssetDepreciation', title: 'Amortissement immobilisation', domain: 'Immobilisations', route: '/enterprise-expansion/fixed-asset-depreciation-module-page', description: 'Module immobilisation avec acquisition, composants, méthode fiscale, sortie et journal.', metrics: [{ label: 'Montant', path: 'acquisition.amount', format: 'money' }, { label: 'Écritures', path: 'journalProposal', format: 'count' }, { label: 'Méthode', path: 'fiscalMethod' }], controls: ['Acquisition', 'Composants', 'Fiscal', 'Journal'] },
  { key: 'leasingTracker', title: 'Contrat leasing', domain: 'Finance', route: '/enterprise-expansion/leasing-contract-tracker-page', description: 'Tracker leasing avec échéancier, option, TVA et classification comptable.', metrics: [{ label: 'Échéances', path: 'paymentSchedule', format: 'count' }, { label: 'Option', path: 'optionValue', format: 'money' }, { label: 'Statut', path: 'status' }], controls: ['Échéancier', 'Option', 'TVA', 'Classification'] },
  { key: 'insuranceRegister', title: 'Registre assurances', domain: 'Risque', route: '/enterprise-expansion/insurance-policy-register-page', description: 'Registre assurance avec actifs, primes, sinistres, expirations et coffre documents.', metrics: [{ label: 'Polices', path: 'rows', format: 'count' }, { label: 'Prime', path: 'rows.0.premiums', format: 'money' }, { label: 'Statut', path: 'status' }], controls: ['Actifs', 'Primes', 'Sinistres', 'Coffre'] },
  { key: 'pettyCashReplenishment', title: 'Réappro petite caisse', domain: 'Finance', route: '/enterprise-expansion/petty-cash-replenishment-workflow-page', description: 'Réappro petite caisse avec reçus, plafonds, reviewer, journal et impact caisse.', metrics: [{ label: 'Reçus', path: 'receipts', format: 'count' }, { label: 'Impact', path: 'cashboxImpact', format: 'money' }, { label: 'Statut', path: 'status' }], controls: ['Reçus', 'Plafonds', 'Reviewer', 'Journal'] },
  { key: 'corporateCardImport', title: 'Import carte corporate', domain: 'Finance', route: '/enterprise-expansion/corporate-card-expense-import-page', description: 'Import carte corporate avec porteur, marchand, TVA, doublons et approbation.', metrics: [{ label: 'Lignes', path: 'rows', format: 'count' }, { label: 'Doublons', path: 'duplicateDetection' }, { label: 'Approbation', path: 'approvalStatus' }], controls: ['Porteur', 'Marchand', 'TVA', 'Doublons'] },
  { key: 'travelMission', title: 'Mission voyage salarié', domain: 'RH', route: '/enterprise-expansion/employee-travel-mission-workflow-page', description: 'Mission voyage avec per diem, transport, logement, refacturable client et settlement.', metrics: [{ label: 'Settlement', path: 'settlement', format: 'money' }, { label: 'Facturable', path: 'clientBillable', format: 'boolean' }, { label: 'Statut', path: 'status' }], controls: ['Per diem', 'Transport', 'Logement', 'Client'] },
  { key: 'slaPenalty', title: 'Pénalité SLA contrat', domain: 'Contrats', route: '/enterprise-expansion/customer-contract-sla-penalty-tracker-page', description: 'Pénalité SLA contrat client avec preuve, ajustement facture, approbation et note légale.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Ajustement', path: 'invoiceAdjustment' }, { label: 'Approbation', path: 'approval' }], controls: ['Preuve', 'Ajustement', 'Approbation', 'Legal'] },
  { key: 'supplierRebate', title: 'Accrual remise fournisseur', domain: 'Achats', route: '/enterprise-expansion/supplier-rebate-accrual-tracker-page', description: 'Accrual remise fournisseur avec seuil, avoir attendu, clôture période et preuve.', metrics: [{ label: 'Volume', path: 'purchaseVolume', format: 'money' }, { label: 'Avoir', path: 'creditNoteExpectation', format: 'money' }, { label: 'Statut', path: 'status' }], controls: ['Seuil', 'Avoir', 'Clôture', 'Preuve'] },
  { key: 'reservationExpiry', title: 'Expiration réservation stock', domain: 'Stock', route: '/enterprise-expansion/inventory-reservation-expiry-workflow-page', description: 'Expiration réservation stock avec commande, priorité client, date release et disponibilité.', metrics: [{ label: 'Disponible', path: 'stockAvailability' }, { label: 'Réservé', path: 'reservedQuantity' }, { label: 'Statut', path: 'status' }], controls: ['Commande', 'Priorité', 'Release', 'Stock'] },
];

export const enterpriseExpansionFeatureByKey = Object.fromEntries(
  enterpriseExpansionFeatureDefinitions.map((definition) => [definition.key, definition]),
) as Record<EnterpriseExpansionFeatureKey, EnterpriseExpansionFeatureDefinition>;
