export type EnterpriseDepthFeatureKey =
  | 'stockDamage'
  | 'substituteMapping'
  | 'priceListImport'
  | 'marginGuardrails'
  | 'salesTargets'
  | 'commissionAccrual'
  | 'collectionQueue'
  | 'customerDispute'
  | 'supplierDispute'
  | 'treasury'
  | 'chequeDepositSlip'
  | 'bouncedCheque'
  | 'bankCategorization'
  | 'recurringExpenses'
  | 'expenseMatrix'
  | 'employeeAdvance'
  | 'employeeLoans'
  | 'overtime'
  | 'attendance'
  | 'leaveConflicts'
  | 'cnssRegistration'
  | 'offboarding'
  | 'maintenanceConsumption'
  | 'fleetAlerts'
  | 'fleetAccident'
  | 'productionQuality'
  | 'productionCapacity'
  | 'projectChange'
  | 'projectWip'
  | 'customerPortalInvoices'
  | 'supplierPortalUpload'
  | 'dataRoom'
  | 'checklistTemplates'
  | 'telemetry'
  | 'competitiveHeatmap'
  | 'retentionPolicy'
  | 'eSignature'
  | 'customerRiskQuestionnaire'
  | 'supplierRiskQuestionnaire'
  | 'deliveryOcr';

export type EnterpriseDepthMetric = {
  label: string;
  path: string;
  format?: 'money' | 'count' | 'boolean';
};

export type EnterpriseDepthFeatureDefinition = {
  key: EnterpriseDepthFeatureKey;
  title: string;
  domain: string;
  route: string;
  description: string;
  metrics: EnterpriseDepthMetric[];
  controls: string[];
};

export const enterpriseDepthFeatureDefinitions: EnterpriseDepthFeatureDefinition[] = [
  { key: 'stockDamage', title: 'Sinistre stock', domain: 'Stock', route: '/enterprise-depth/stock-damage-claim-page', description: 'Dossier de dommage avec photo, cause racine, quarantaine et écriture comptable.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Impact', path: 'accountingImpact', format: 'money' }, { label: 'Photo', path: 'photoEvidenceStatus' }], controls: ['Photo preuve placeholder', 'Cause racine', 'Impact PCGE', 'Quarantaine stock'] },
  { key: 'substituteMapping', title: 'Substituts article', domain: 'Stock', route: '/enterprise-depth/product-substitute-mapping-page', description: 'Mapping de substitution avec recommandation stockout, marge et restriction client.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Substituts', path: 'substitutions', format: 'count' }, { label: 'Recommandations', path: 'recommendation.rows', format: 'count' }], controls: ['Stock disponible', 'Marge comparée', 'Restriction client', 'Priorité recommandée'] },
  { key: 'priceListImport', title: 'Import tarifs client', domain: 'Ventes', route: '/enterprise-depth/customer-price-list-import-page', description: 'Import de grilles tarifaires avec dates, paliers quantité et piste d’approbation.', metrics: [{ label: 'Importées', path: 'importedRows' }, { label: 'Statut', path: 'status' }, { label: 'Checksum', path: 'approvalAudit.checksum' }], controls: ['Dates valides', 'Paliers quantité', 'Approbateur', 'Checksum import'] },
  { key: 'marginGuardrails', title: 'Garde-fous marge', domain: 'Ventes', route: '/enterprise-depth/margin-guardrails-page', description: 'Contrôle marge sur devis, commandes, POS et jalons projet.', metrics: [{ label: 'Lignes', path: 'rows', format: 'count' }, { label: 'Bloquées', path: 'blocked' }, { label: 'Politique', path: 'policy' }], controls: ['Seuil devis', 'Seuil commande', 'Seuil POS', 'Seuil projet'] },
  { key: 'salesTargets', title: 'Objectifs commerciaux', domain: 'Analytics', route: '/enterprise-depth/sales-target-dashboard-page', description: 'Objectifs par agence, vendeur, famille produit et région marocaine.', metrics: [{ label: 'Période', path: 'period' }, { label: 'Lignes', path: 'rows', format: 'count' }, { label: 'Écart', path: 'variance', format: 'money' }], controls: ['Agence', 'Commercial', 'Famille', 'Région Maroc'] },
  { key: 'commissionAccrual', title: 'Provision commissions', domain: 'Comptabilité', route: '/enterprise-depth/sales-commission-accrual-page', description: 'Commission commerciale dépendante de l’encaissement et validée par comptable.', metrics: [{ label: 'Statut', path: 'approvalStatus' }, { label: 'Provision', path: 'accruedAmount', format: 'money' }, { label: 'Dépendance', path: 'paymentDependency' }], controls: ['Facture payée', 'Calcul marge', 'Approbation comptable', 'Écriture PCGE'] },
  { key: 'collectionQueue', title: 'File recouvrement', domain: 'Finance', route: '/enterprise-depth/receivable-collection-queue-page', description: 'Queue de recouvrement avec promesse, litige, niveau de relance et prochain responsable.', metrics: [{ label: 'Dossiers', path: 'rows', format: 'count' }, { label: 'Premier niveau', path: 'rows.0.dunningLevel' }, { label: 'Owner', path: 'rows.0.nextOwner' }], controls: ['Promesse', 'Litige', 'Relance', 'Responsable'] },
  { key: 'customerDispute', title: 'SLA litige client', domain: 'CRM', route: '/enterprise-depth/customer-dispute-resolution-page', description: 'Litige client avec cause racine, décision avoir et preuve légale.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'SLA', path: 'slaDueAt' }, { label: 'Décision', path: 'creditNoteDecision' }], controls: ['Cause racine', 'Avoir éventuel', 'Preuve légale', 'Blocage recouvrement'] },
  { key: 'supplierDispute', title: 'SLA litige fournisseur', domain: 'Achats', route: '/enterprise-depth/supplier-dispute-resolution-page', description: 'Litige fournisseur avec paiements bloqués, exception réception et notes de règlement.', metrics: [{ label: 'Paiements bloqués', path: 'blockedPayments', format: 'count' }, { label: 'Exceptions', path: 'receiptExceptions', format: 'count' }, { label: 'SLA', path: 'slaDueAt' }], controls: ['Blocage paiement', 'Écart réception', 'Note règlement', 'SLA achat'] },
  { key: 'treasury', title: 'Position trésorerie', domain: 'Trésorerie', route: '/enterprise-depth/treasury-cash-position-page', description: 'Vision banques, caisses, chèques et paiements planifiés.', metrics: [{ label: 'Banques', path: 'banks', format: 'money' }, { label: 'Chèques', path: 'cheques', format: 'money' }, { label: 'Net', path: 'netPosition', format: 'money' }], controls: ['Banque', 'Caisse', 'Chèques', 'Paiements prévus'] },
  { key: 'chequeDepositSlip', title: 'Bordereau chèques', domain: 'Trésorerie', route: '/enterprise-depth/cheque-deposit-slip-page', description: 'Bordereau de remise avec banque, agence, chèques et rapprochement.', metrics: [{ label: 'Bordereau', path: 'slipNumber' }, { label: 'Chèques', path: 'cheques', format: 'count' }, { label: 'Statut', path: 'reconciliationStatus' }], controls: ['Banque', 'Agence', 'Liste chèques', 'Rapprochement'] },
  { key: 'bouncedCheque', title: 'Chèque impayé', domain: 'Trésorerie', route: '/enterprise-depth/bounced-cheque-workflow-page', description: 'Workflow chèque rejeté avec frais, notification et proposition comptable.', metrics: [{ label: 'Frais', path: 'fee', format: 'money' }, { label: 'Notification', path: 'customerNotification' }, { label: 'Blocage', path: 'holdPolicy' }], controls: ['Frais banque', 'Notification client', 'Blocage commandes', 'Écriture proposée'] },
  { key: 'bankCategorization', title: 'Catégorisation bancaire', domain: 'Banque', route: '/enterprise-depth/bank-statement-categorization-page', description: 'Règles par libellé, montant, RIB contrepartie et agence tenant.', metrics: [{ label: 'Règles', path: 'rules', format: 'count' }, { label: 'Lignes', path: 'rows', format: 'count' }, { label: 'Catégorie', path: 'rows.0.category' }], controls: ['Libellé', 'Montant', 'RIB', 'Agence'] },
  { key: 'recurringExpenses', title: 'Calendrier charges', domain: 'Achats', route: '/enterprise-depth/recurring-expense-calendar-page', description: 'Calendrier loyer, télécom, assurance, leasing, utilities et acomptes fiscaux.', metrics: [{ label: 'Charges', path: 'rows', format: 'count' }, { label: 'Prochaine catégorie', path: 'rows.0.category' }, { label: 'Montant', path: 'rows.0.amount', format: 'money' }], controls: ['Loyer', 'Télécom', 'Assurance', 'Acomptes'] },
  { key: 'expenseMatrix', title: 'Matrice frais', domain: 'Finance', route: '/enterprise-depth/expense-approval-matrix-page', description: 'Matrice par catégorie, projet, agence, montant et budget owner.', metrics: [{ label: 'Règles', path: 'rows', format: 'count' }, { label: 'Owner', path: 'rows.0.budgetOwner' }, { label: 'Seuil', path: 'rows.0.amountThreshold', format: 'money' }], controls: ['Catégorie', 'Projet', 'Agence', 'Budget owner'] },
  { key: 'employeeAdvance', title: 'Avance salarié', domain: 'Paie', route: '/enterprise-depth/employee-advance-request-page', description: 'Demande d’avance avec échéancier, retenue paie et preuve d’approbation.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Montant', path: 'amount', format: 'money' }, { label: 'Retenue', path: 'payrollDeduction', format: 'money' }], controls: ['Plan remboursement', 'Retenue paie', 'Approbation', 'Preuve'] },
  { key: 'employeeLoans', title: 'Grand livre prêts', domain: 'Paie', route: '/enterprise-depth/employee-loan-ledger-page', description: 'Ledger des prêts salariés avec solde, plafond mensuel et explication bulletin.', metrics: [{ label: 'Prêts', path: 'rows', format: 'count' }, { label: 'Solde', path: 'rows.0.outstanding', format: 'money' }, { label: 'Mois restants', path: 'rows.0.remainingMonths' }], controls: ['Solde', 'Plafond', 'Bulletin', 'Statut'] },
  { key: 'overtime', title: 'Heures supplémentaires', domain: 'Paie', route: '/enterprise-depth/overtime-planning-approval-page', description: 'Planification overtime avec budget département, multiplicateur et impact paie.', metrics: [{ label: 'Budget', path: 'departmentBudget', format: 'money' }, { label: 'Impact', path: 'payrollImpactPreview', format: 'money' }, { label: 'Statut', path: 'budgetStatus' }], controls: ['Budget service', 'Taux', 'Impact paie', 'Approbation'] },
  { key: 'attendance', title: 'Import présence', domain: 'RH', route: '/enterprise-depth/attendance-import-validation-page', description: 'Validation d’import biométrique avec anomalies et impact paie.', metrics: [{ label: 'Source', path: 'source' }, { label: 'Lignes', path: 'rows', format: 'count' }, { label: 'Statut', path: 'status' }], controls: ['Matricule', 'Entrée/sortie', 'Anomalies', 'Impact paie'] },
  { key: 'leaveConflicts', title: 'Conflits congés', domain: 'RH', route: '/enterprise-depth/leave-calendar-conflicts-page', description: 'Détection conflits congés par département, jours fériés et rôles critiques.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Conflits', path: 'rows', format: 'count' }, { label: 'Rôle critique', path: 'rows.0.criticalRole', format: 'boolean' }], controls: ['Département', 'Jours fériés', 'Rôle critique', 'Revue manager'] },
  { key: 'cnssRegistration', title: 'Checklist CNSS', domain: 'Paie', route: '/enterprise-depth/cnss-registration-checklist-page', description: 'Checklist immatriculation CNSS pour nouveaux salariés et preuves contrat.', metrics: [{ label: 'Salariés', path: 'rows', format: 'count' }, { label: 'Premier statut', path: 'rows.0.status' }, { label: 'Contrat', path: 'rows.0.contractEvidence' }], controls: ['Identifiant CNSS', 'Contrat', 'Blocage', 'Prêt déclaration'] },
  { key: 'offboarding', title: 'Offboarding salarié', domain: 'RH', route: '/enterprise-depth/employee-offboarding-workflow-page', description: 'Départ salarié avec paie finale, retour actifs, archive et révocation accès.', metrics: [{ label: 'Accès', path: 'accessRevocation' }, { label: 'Net final', path: 'finalPayroll.netSettlement', format: 'money' }, { label: 'Archive', path: 'documentArchiveId' }], controls: ['Paie finale', 'Retour actifs', 'Archive', 'Révocation'] },
  { key: 'maintenanceConsumption', title: 'Consommation maintenance', domain: 'Maintenance', route: '/enterprise-depth/maintenance-spare-part-consumption-page', description: 'Consommation de pièce maintenance avec déduction dépôt, CUMP et coût ordre.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'CUMP', path: 'cumpValuation', format: 'money' }, { label: 'Coût OT', path: 'workOrderCost', format: 'money' }], controls: ['Déduction stock', 'CUMP', 'Ordre travail', 'Rollup coût'] },
  { key: 'fleetAlerts', title: 'Alertes documents flotte', domain: 'Flotte', route: '/enterprise-depth/fleet-document-alerts-page', description: 'Alertes assurance, vignette, visite technique, autorisation et permis.', metrics: [{ label: 'Alertes', path: 'rows', format: 'count' }, { label: 'Document', path: 'rows.0.document' }, { label: 'Alerte', path: 'rows.0.alert' }], controls: ['Assurance', 'Vignette', 'Visite technique', 'Permis'] },
  { key: 'fleetAccident', title: 'Dossier accident flotte', domain: 'Flotte', route: '/enterprise-depth/fleet-accident-case-page', description: 'Dossier accident avec photos, assurance, réparation et suivi coût.', metrics: [{ label: 'Assurance', path: 'insuranceClaim' }, { label: 'Coût', path: 'costTracking', format: 'money' }, { label: 'Réparation', path: 'repairOrderId' }], controls: ['Photos', 'Sinistre assurance', 'Ordre réparation', 'Coût'] },
  { key: 'productionQuality', title: 'Qualité production', domain: 'Production', route: '/enterprise-depth/production-quality-checklist-page', description: 'Checklist qualité avec rebut, reprise, pass/fail et blocage produits finis.', metrics: [{ label: 'Résultat', path: 'status' }, { label: 'Blocage PF', path: 'finishedGoodsHold', format: 'boolean' }, { label: 'Checklist', path: 'checklist', format: 'count' }], controls: ['Rebut', 'Rework', 'Pass/fail', 'Hold stock'] },
  { key: 'productionCapacity', title: 'Capacité production', domain: 'Production', route: '/enterprise-depth/production-capacity-planning-page', description: 'Planning par poste, opérateur, shift et disponibilité composants.', metrics: [{ label: 'Postes', path: 'rows', format: 'count' }, { label: 'Composants', path: 'rows.0.componentAvailability' }, { label: 'Capacité', path: 'rows.0.capacityStatus' }], controls: ['Poste', 'Opérateur', 'Shift', 'Composants'] },
  { key: 'projectChange', title: 'Change request projet', domain: 'Projets', route: '/enterprise-depth/project-change-request-page', description: 'Demande de changement avec delta budget, délai, validation client et effet facture.', metrics: [{ label: 'Statut', path: 'status' }, { label: 'Delta budget', path: 'budgetDelta', format: 'money' }, { label: 'Validation', path: 'customerApproval' }], controls: ['Budget', 'Délai', 'Client', 'Facturation'] },
  { key: 'projectWip', title: 'WIP projets', domain: 'Projets', route: '/enterprise-depth/project-wip-dashboard-page', description: 'Dashboard WIP avec earned value, coûts non facturés, risque jalon et notes comptables.', metrics: [{ label: 'Projets', path: 'rows', format: 'count' }, { label: 'Earned value', path: 'rows.0.earnedValue', format: 'money' }, { label: 'Risque', path: 'rows.0.milestoneRisk' }], controls: ['Earned value', 'Coûts non facturés', 'Jalon', 'Note comptable'] },
  { key: 'customerPortalInvoices', title: 'Portail client factures', domain: 'Portails', route: '/enterprise-depth/customer-portal-invoice-view-page', description: 'Vue portail client avec relevé, promesses, litiges et preuves fichiers.', metrics: [{ label: 'Factures', path: 'invoices', format: 'count' }, { label: 'Promesses', path: 'paymentPromises', format: 'count' }, { label: 'Preuve', path: 'fileEvidenceId' }], controls: ['Relevé', 'Promesse paiement', 'Litige', 'Fichier'] },
  { key: 'supplierPortalUpload', title: 'Portail fournisseur documents', domain: 'Portails', route: '/enterprise-depth/supplier-portal-document-upload-page', description: 'Upload placeholder fournisseur avec validation et rappels renouvellement.', metrics: [{ label: 'Slots', path: 'uploadSlots', format: 'count' }, { label: 'Validation', path: 'validationStatus' }, { label: 'Premier statut', path: 'uploadSlots.0.status' }], controls: ['Attestation fiscale', 'CNSS', 'RIB', 'Contrat'] },
  { key: 'dataRoom', title: 'Data room comptable', domain: 'Comptabilité', route: '/enterprise-depth/tenant-data-room-page', description: 'Data room pour handoff comptable avec packs période, checklist preuves et checksum.', metrics: [{ label: 'Période', path: 'period' }, { label: 'Packs', path: 'periodPacks', format: 'count' }, { label: 'Checksum', path: 'checksum' }], controls: ['Packs période', 'Checklist', 'Checksum', 'Restore'] },
  { key: 'checklistTemplates', title: 'Templates implémentation', domain: 'Implémentation', route: '/enterprise-depth/implementation-checklist-templates-page', description: 'Checklists par industrie: retail, wholesale, services, manufacturing, construction.', metrics: [{ label: 'Templates', path: 'templates', format: 'count' }, { label: 'Premier', path: 'templates.0.industry' }, { label: 'Jours', path: 'templates.0.estimatedDays' }], controls: ['Retail', 'Wholesale', 'Services', 'Manufacturing', 'Construction'] },
  { key: 'telemetry', title: 'Télémetrie usage', domain: 'SaaS', route: '/enterprise-depth/usage-telemetry-dashboard-page', description: 'Adoption modules, utilisateurs dormants, actions échouées et besoins formation.', metrics: [{ label: 'Modules', path: 'moduleAdoption', format: 'count' }, { label: 'Dormants', path: 'dormantUsers', format: 'count' }, { label: 'Formations', path: 'trainingNeeds', format: 'count' }], controls: ['Adoption', 'Dormance', 'Échecs', 'Formation'] },
  { key: 'competitiveHeatmap', title: 'Heatmap concurrentielle', domain: 'Stratégie', route: '/enterprise-depth/competitive-gap-heatmap-page', description: 'Comparaison Odoo, Sage, Cegid, Zoho et alternatives ERP marocaines.', metrics: [{ label: 'Concurrents', path: 'competitors', format: 'count' }, { label: 'Lignes', path: 'rows', format: 'count' }, { label: 'Avantage', path: 'rows.0.ourAdvantage' }], controls: ['Odoo', 'Sage', 'Cegid', 'Zoho', 'ERP local'] },
  { key: 'retentionPolicy', title: 'Rétention documentaire', domain: 'Conformité', route: '/enterprise-depth/electronic-document-retention-page', description: 'Politique de conservation électronique par période fiscale, type, checksum et legal hold.', metrics: [{ label: 'Années', path: 'retentionYears' }, { label: 'Checksum', path: 'checksumRequired', format: 'boolean' }, { label: 'Documents', path: 'rows', format: 'count' }], controls: ['Période fiscale', 'Type document', 'Checksum', 'Legal hold'] },
  { key: 'eSignature', title: 'E-signature facture', domain: 'Conformité', route: '/enterprise-depth/invoice-e-signature-readiness-page', description: 'Préparation signature facture avec certificat, workflow signataire et archive immuable.', metrics: [{ label: 'Archive', path: 'immutableArchiveStatus' }, { label: 'Certificat', path: 'certificateMetadata.serial' }, { label: 'Workflow', path: 'signerWorkflow', format: 'count' }], controls: ['Certificat', 'Signataire', 'Workflow', 'Archive'] },
  { key: 'customerRiskQuestionnaire', title: 'Questionnaire risque client', domain: 'CRM', route: '/enterprise-depth/customer-onboarding-risk-questionnaire-page', description: 'Onboarding client avec ICE/IF/RC, secteur, crédit et notes sanctions.', metrics: [{ label: 'Items', path: 'items', format: 'count' }, { label: 'Risque', path: 'riskLevel' }, { label: 'ICE', path: 'items.0.valid', format: 'boolean' }], controls: ['ICE', 'IF', 'RC', 'Sanctions'] },
  { key: 'supplierRiskQuestionnaire', title: 'Questionnaire risque fournisseur', domain: 'Achats', route: '/enterprise-depth/supplier-onboarding-risk-questionnaire-page', description: 'Onboarding fournisseur avec fiscal, CNSS, RIB, contrat et approbation risque.', metrics: [{ label: 'Items', path: 'items', format: 'count' }, { label: 'Statut', path: 'status' }, { label: 'Risque', path: 'riskApprovalRequired', format: 'boolean' }], controls: ['Fiscal', 'CNSS', 'RIB', 'Contrat'] },
  { key: 'deliveryOcr', title: 'OCR preuve livraison', domain: 'Logistique', route: '/enterprise-depth/delivery-proof-photo-ocr-page', description: 'Placeholder OCR photo de livraison avec validation, géotag, timestamp et signature chauffeur.', metrics: [{ label: 'OCR', path: 'ocrStatus' }, { label: 'Validation', path: 'manualValidation', format: 'boolean' }, { label: 'Signature', path: 'driverSignature' }], controls: ['Photo', 'Géotag', 'Timestamp', 'Signature'] },
];

export const enterpriseDepthFeatureByKey = Object.fromEntries(
  enterpriseDepthFeatureDefinitions.map((definition) => [definition.key, definition]),
) as Record<EnterpriseDepthFeatureKey, EnterpriseDepthFeatureDefinition>;
