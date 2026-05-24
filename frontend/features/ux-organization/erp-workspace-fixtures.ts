export type WorkspaceStatus = 'ok' | 'warning' | 'danger' | 'info' | 'blocked';

export type WorkspaceKpi = {
  label: string;
  value: string;
  trend: string;
  status: WorkspaceStatus;
};

export type WorkspaceDocument = {
  number: string;
  party: string;
  amount: string;
  status: string;
  owner: string;
};

export type WorkspaceDefinition = {
  id: string;
  title: string;
  shortTitle: string;
  href: string;
  icon: string;
  roles: string[];
  pinned: boolean;
  health: WorkspaceStatus;
  healthLabel: string;
  subtitle: string;
  primaryAction: string;
  tabs: string[];
  savedFilters: string[];
  kpis: WorkspaceKpi[];
  alerts: string[];
  recentDocuments: WorkspaceDocument[];
};

export type StatusStep = {
  label: string;
  state: 'done' | 'current' | 'next' | 'blocked';
};

export type TableColumn = {
  label: string;
  sortable?: boolean;
  numeric?: boolean;
};

export type TableRow = {
  cells: string[];
  status?: WorkspaceStatus;
};

export const rolePresets = [
  {
    role: 'Direction',
    workspaces: ['Ventes', 'Achats/Stock', 'Comptabilité', 'Paie/RH', 'Admin/Conformité'],
    focus: 'Trésorerie, impayés, stock critique, paie à valider et échéances fiscales.',
  },
  {
    role: 'Commercial',
    workspaces: ['Ventes', 'CRM'],
    focus: 'Prospects, devis, commandes, relances clients et promesses de paiement.',
  },
  {
    role: 'Comptable',
    workspaces: ['Comptabilité', 'Admin/Conformité', 'Ventes'],
    focus: 'TVA, journaux, rapprochement bancaire, justificatifs et clôture de période.',
  },
  {
    role: 'Magasinier',
    workspaces: ['Achats/Stock'],
    focus: 'Réceptions, réservations, inventaires, lots, écarts et CUMP.',
  },
  {
    role: 'RH',
    workspaces: ['Paie/RH'],
    focus: 'Salariés, contrats, bulletins, congés, CNSS/AMO/IR et Damancom.',
  },
  {
    role: 'Caissier',
    workspaces: ['POS', 'Achats/Stock'],
    focus: 'Session caisse, tickets, remboursements, Z de caisse et file hors ligne.',
  },
  {
    role: 'Admin',
    workspaces: ['Admin/Conformité', 'Comptabilité'],
    focus: 'Utilisateurs, rôles, numérotation, adaptateurs, audit et abonnement.',
  },
];

export const workspaces: WorkspaceDefinition[] = [
  {
    id: 'ventes',
    title: 'Ventes',
    shortTitle: 'Ventes',
    href: '/ventes',
    icon: 'VE',
    roles: ['Direction', 'Commercial', 'Comptable'],
    pinned: true,
    health: 'warning',
    healthLabel: 'Relances à traiter',
    subtitle: 'Pipeline, devis, commandes, BL, factures, avoirs et paiements clients.',
    primaryAction: 'Nouveau devis',
    tabs: ['Vue d’ensemble', 'Devis', 'Commandes', 'Livraisons', 'Factures', 'Paiements'],
    savedFilters: ['Mes devis à approuver', 'Factures échues', 'Clients sous limite crédit'],
    kpis: [
      { label: 'Devis ouverts', value: '18', trend: '+4 cette semaine', status: 'info' },
      { label: 'CA facturé', value: '428 000 MAD', trend: '+12 % mois', status: 'ok' },
      { label: 'Impayés', value: '86 400 MAD', trend: '7 factures échues', status: 'warning' },
    ],
    alerts: ['Facture FAC-2026-014 échue depuis 12 jours', 'Devis DV-2026-022 nécessite validation marge'],
    recentDocuments: [
      { number: 'DV-2026-022', party: 'Atlas Bureautique SARL', amount: '34 800 MAD', status: 'Approbation requise', owner: 'Commercial' },
      { number: 'FAC-2026-014', party: 'Casa Retail', amount: '18 240 MAD', status: 'Échue', owner: 'Recouvrement' },
      { number: 'BL-2026-031', party: 'Tanger Services', amount: '12 900 MAD', status: 'À facturer', owner: 'Logistique' },
    ],
  },
  {
    id: 'achats-stock',
    title: 'Achats/Stock',
    shortTitle: 'Achats',
    href: '/achats-stock',
    icon: 'AS',
    roles: ['Direction', 'Magasinier', 'Comptable'],
    pinned: true,
    health: 'danger',
    healthLabel: 'Stock critique',
    subtitle: 'Fournisseurs, demandes d’achat, commandes, réceptions, réservations et inventaires.',
    primaryAction: 'Créer demande achat',
    tabs: ['Vue d’ensemble', 'Fournisseurs', 'Commandes achat', 'Réceptions', 'Articles', 'Inventaires'],
    savedFilters: ['Articles sous seuil', 'Réceptions avec écart', 'Factures fournisseurs à rapprocher'],
    kpis: [
      { label: 'Valeur stock', value: '479 000 MAD', trend: 'CUMP vérifié', status: 'ok' },
      { label: 'Sous seuil', value: '11 articles', trend: '4 urgents', status: 'danger' },
      { label: 'Réceptions attendues', value: '9', trend: '2 en retard', status: 'warning' },
    ],
    alerts: ['SKU-CHAIR réservé depuis 9 jours', 'BC-2026-018 présente un écart de prix fournisseur'],
    recentDocuments: [
      { number: 'BC-2026-018', party: 'Fournitures Nord', amount: '67 200 MAD', status: 'Réception partielle', owner: 'Achats' },
      { number: 'REC-2026-041', party: 'Dépôt Ain Sebaa', amount: '22 lignes', status: 'Écart quantité', owner: 'Magasinier' },
      { number: 'INV-COUNT-05', party: 'Dépôt Rabat', amount: '176 lignes', status: 'À approuver', owner: 'Stock' },
    ],
  },
  {
    id: 'comptabilite',
    title: 'Comptabilité',
    shortTitle: 'Compta',
    href: '/comptabilite',
    icon: 'CO',
    roles: ['Direction', 'Comptable', 'Admin'],
    pinned: true,
    health: 'warning',
    healthLabel: 'TVA à préparer',
    subtitle: 'PCGE, écritures, TVA, périodes, rapprochement bancaire, exports et preuves.',
    primaryAction: 'Nouvelle écriture',
    tabs: ['Vue d’ensemble', 'PCGE', 'Journaux', 'TVA', 'Périodes', 'Banque'],
    savedFilters: ['Écritures brouillon', 'TVA avec exception', 'Pièces manquantes'],
    kpis: [
      { label: 'Balance', value: 'Équilibrée', trend: 'Classe 1 à 7', status: 'ok' },
      { label: 'TVA nette', value: '38 600 MAD', trend: 'Échéance 20/06', status: 'warning' },
      { label: 'Pièces manquantes', value: '6', trend: '2 bloquantes', status: 'danger' },
    ],
    alerts: ['Période 05/2026 prête pour revue', 'Journal OD-2026-008 sans pièce justificative'],
    recentDocuments: [
      { number: 'JRN-VENTES-05', party: 'Journal ventes', amount: '128 lignes', status: 'Comptabilisé', owner: 'Comptable' },
      { number: 'TVA-05-2026', party: 'Déclaration TVA', amount: '38 600 MAD', status: 'Préparation', owner: 'Fiscal' },
      { number: 'RAPP-BMCE-05', party: 'Rapprochement banque', amount: '14 lignes', status: 'À matcher', owner: 'Trésorerie' },
    ],
  },
  {
    id: 'paie-rh',
    title: 'Paie/RH',
    shortTitle: 'Paie',
    href: '/paie',
    icon: 'RH',
    roles: ['Direction', 'RH', 'Comptable'],
    pinned: true,
    health: 'info',
    healthLabel: 'Préflight CNSS',
    subtitle: 'Salariés, contrats, runs paie, bulletins, congés, CNSS/AMO/IR et Damancom.',
    primaryAction: 'Calculer paie',
    tabs: ['Vue d’ensemble', 'Salariés', 'Contrats', 'Paie', 'Bulletins', 'Damancom'],
    savedFilters: ['Salariés sans CNSS', 'Bulletins à valider', 'Congés à approuver'],
    kpis: [
      { label: 'Salariés actifs', value: '42', trend: '3 contrats à renouveler', status: 'info' },
      { label: 'Net à payer', value: '318 900 MAD', trend: 'Run brouillon', status: 'warning' },
      { label: 'Anomalies CNSS', value: '2', trend: 'Identifiants manquants', status: 'danger' },
    ],
    alerts: ['Salarié S-018 sans numéro CNSS', 'Run PAY-2026-05 en attente validation RH'],
    recentDocuments: [
      { number: 'PAY-2026-05', party: 'Paie mai 2026', amount: '42 bulletins', status: 'Calculée', owner: 'RH' },
      { number: 'DAM-2026-05', party: 'Export Damancom', amount: '42 lignes', status: 'Préflight', owner: 'Comptable' },
      { number: 'CON-2026-017', party: 'Avenant salaire', amount: '1 salarié', status: 'Signature', owner: 'RH' },
    ],
  },
  {
    id: 'admin-conformite',
    title: 'Admin/Conformité',
    shortTitle: 'Admin',
    href: '/admin',
    icon: 'AC',
    roles: ['Direction', 'Admin', 'Comptable'],
    pinned: false,
    health: 'ok',
    healthLabel: 'Configuration suivie',
    subtitle: 'Paramètres tenant, utilisateurs, rôles, numérotation, adaptateurs, archive légale et audit.',
    primaryAction: 'Inviter utilisateur',
    tabs: ['Vue d’ensemble', 'Tenant', 'Utilisateurs', 'Numérotation', 'Adaptateurs', 'Audit'],
    savedFilters: ['Rôles sensibles', 'Numérotation verrouillée', 'Adaptateurs sandbox'],
    kpis: [
      { label: 'Complétude setup', value: '84 %', trend: 'ICE/IF/RC prêts', status: 'ok' },
      { label: 'Notifications', value: '12', trend: '5 critiques', status: 'warning' },
      { label: 'Audit', value: '312 traces', trend: 'Aucune rupture', status: 'ok' },
    ],
    alerts: ['Connecteur DGI en mode sandbox', 'Sauvegarde restaurée en rehearsal il y a 3 jours'],
    recentDocuments: [
      { number: 'ROLE-ADMIN', party: 'Matrice permissions', amount: '9 rôles', status: 'À revoir', owner: 'Admin' },
      { number: 'NUM-2026', party: 'Séries documents', amount: '7 séries', status: 'Verrouillées', owner: 'Comptable' },
      { number: 'ARCH-2026-05', party: 'Archive légale', amount: '24 preuves', status: 'Intègre', owner: 'Conformité' },
    ],
  },
];

export const notificationItems = [
  { severity: 'danger', label: 'Approbation remise', detail: 'DV-2026-022 dépasse le seuil marge', action: 'Ouvrir devis' },
  { severity: 'warning', label: 'Paiement en retard', detail: 'FAC-2026-014 échue depuis 12 jours', action: 'Relancer client' },
  { severity: 'warning', label: 'Stock bas', detail: 'SKU-CHAIR sous seuil au dépôt Casablanca', action: 'Créer demande achat' },
  { severity: 'info', label: 'Paie bloquée', detail: '2 salariés sans identifiant CNSS', action: 'Corriger dossiers' },
  { severity: 'info', label: 'Date fiscale', detail: 'TVA mai à déposer avant le 20/06', action: 'Préparer pack' },
];

export const setupItems = [
  { label: 'ICE', detail: '001525874000033', status: 'ok', href: '/admin#identite-legale' },
  { label: 'IF', detail: '15258740', status: 'ok', href: '/admin#identite-legale' },
  { label: 'RC', detail: 'RC Casablanca 98421', status: 'ok', href: '/admin#identite-legale' },
  { label: 'Patente', detail: 'P-2026-CASA', status: 'ok', href: '/admin#identite-legale' },
  { label: 'CNSS', detail: '2 salariés incomplets', status: 'warning', href: '/paie#damancom' },
  { label: 'TVA', detail: 'Régime mensuel', status: 'ok', href: '/comptabilite#tva' },
  { label: 'Période fiscale', detail: 'Mai 2026 ouvert', status: 'info', href: '/comptabilite#periode' },
  { label: 'Numérotation', detail: 'Séries ventes verrouillées', status: 'ok', href: '/admin#numerotation' },
  { label: 'Banques', detail: '1 compte à rapprocher', status: 'warning', href: '/comptabilite#banque' },
];

export const commandResults = [
  { type: 'Créer', label: 'Nouveau devis', shortcut: 'N', target: '/ventes#nouveau-devis' },
  { type: 'Créer', label: 'Demande achat', shortcut: 'A', target: '/achats-stock#demande-achat' },
  { type: 'Ouvrir', label: 'FAC-2026-014', shortcut: 'F', target: '/ventes#facture-preview' },
  { type: 'Rechercher', label: 'Client par ICE', shortcut: 'I', target: '/ventes#client-360' },
  { type: 'Exporter', label: 'Pack TVA', shortcut: 'T', target: '/comptabilite#tva' },
];

export const statusPipelines: Record<string, StatusStep[]> = {
  sales: [
    { label: 'Devis', state: 'done' },
    { label: 'Commande', state: 'current' },
    { label: 'BL', state: 'next' },
    { label: 'Facture', state: 'next' },
    { label: 'Paiement', state: 'next' },
  ],
  purchase: [
    { label: 'Demande', state: 'done' },
    { label: 'BC', state: 'done' },
    { label: 'Réception', state: 'current' },
    { label: 'Facture fournisseur', state: 'next' },
    { label: 'Paiement', state: 'next' },
  ],
  inventory: [
    { label: 'Brouillon', state: 'done' },
    { label: 'Comptage', state: 'current' },
    { label: 'Écart', state: 'next' },
    { label: 'Approbation', state: 'next' },
    { label: 'Comptabilisation', state: 'blocked' },
  ],
};

export const salesWorkspace = {
  pipeline: [
    { stage: 'Nouveau', count: '8', value: '72 000 MAD', owner: 'Commercial Casa' },
    { stage: 'Qualification', count: '5', value: '94 500 MAD', owner: 'Direction ventes' },
    { stage: 'Devis envoyé', count: '7', value: '186 400 MAD', owner: 'Commerciaux' },
    { stage: 'Négociation', count: '3', value: '58 000 MAD', owner: 'Direction' },
  ],
  documents: [
    ['DV-2026-022', 'Atlas Bureautique SARL', '34 800 MAD', 'Approbation requise', 'Marge 17 %'],
    ['CMD-2026-019', 'Rabat Distribution', '22 500 MAD', 'Prête livraison', 'Crédit OK'],
    ['BL-2026-031', 'Tanger Services', '12 900 MAD', 'À facturer', 'Stock réservé'],
    ['FAC-2026-014', 'Casa Retail', '18 240 MAD', 'Échue', 'Relance niveau 2'],
  ],
  documentLines: [
    ['SKU-CHAIR', 'Chaise bureau', '12', '1 250 MAD', '20 %', '18 000 MAD'],
    ['SERV-LIV', 'Livraison Casablanca', '1', '600 MAD', '20 %', '720 MAD'],
  ],
  customerTimeline: [
    'Devis DV-2026-022 envoyé par Salma',
    'Promesse paiement FAC-2026-014 au 30/05',
    'Litige transport clôturé avec avoir AV-2026-004',
  ],
  unpaid: [
    ['0-30 jours', '42 100 MAD', '3 factures', 'Relance simple'],
    ['31-60 jours', '18 240 MAD', '1 facture', 'Appel recouvrement'],
    ['60+ jours', '26 060 MAD', '3 factures', 'Blocage crédit'],
  ],
  creditNoteLines: [
    ['SKU-CHAIR', '2', 'Défaut qualité accepté', '3 000 MAD', 'TVA 20 %'],
    ['SERV-LIV', '1', 'Geste commercial validé', '600 MAD', 'TVA 20 %'],
  ],
};

export const purchasesInventoryWorkspace = {
  suppliers: [
    ['Fournitures Nord', 'ICE 002145879000021', 'RIB validé', '92/100', 'Préféré'],
    ['Transit Maghreb', 'ICE 001984221000038', 'Contrat à renouveler', '78/100', 'Surveillance'],
    ['Papeterie Atlas', 'ICE manquant', 'KYS incomplet', '54/100', 'Bloqué achat'],
  ],
  purchaseOrders: [
    ['BC-2026-018', 'Fournitures Nord', '67 200 MAD', 'Réception partielle', 'Budget consommé 64 %'],
    ['DA-2026-044', 'Papeterie Atlas', '8 900 MAD', 'Approbation requise', 'KYS incomplet'],
    ['BC-2026-020', 'Transit Maghreb', '14 500 MAD', 'Attente facture', 'Landed cost à valider'],
  ],
  receipts: [
    ['SKU-CHAIR', '6111000000010', '48 reçus / 50 attendus', 'Écart -2', 'CUMP 524 MAD'],
    ['RAW-BOIS', '6111000000027', '200 reçus / 200 attendus', 'OK', 'CUMP 90 MAD'],
  ],
  invoiceMatches: [
    ['BC-2026-018', 'REC-2026-041', 'FF-2026-078', 'TVA 20 %', 'Écart prix 2,4 %'],
    ['BC-2026-020', 'REC-2026-045', 'Sans facture', 'À venir', 'Rapprochement bloqué'],
  ],
  stockOverview: [
    ['SKU-CHAIR', 'Chaise bureau', 'Casablanca', '50', '18 réservé', '26 000 MAD', 'Sous seuil'],
    ['RAW-BOIS', 'Bois traité', 'Rabat', '200', '0 réservé', '18 000 MAD', 'OK'],
    ['FG-TABLE', 'Table assemblée', 'Tanger', '8', '4 réservé', '2 400 MAD', 'Quarantaine partielle'],
  ],
  productHistory: [
    '12 factures client sur 90 jours',
    '3 commandes achat liées au fournisseur préféré',
    'Marge brute moyenne 31 %',
    'CUMP recalculé sans période verrouillée',
  ],
  warehouses: [
    ['Casablanca Ain Sebaa', '479 lignes', '68 % disponible', '18 % réservé', '3 % bloqué', '324 000 MAD'],
    ['Rabat Agdal', '211 lignes', '74 % disponible', '8 % réservé', '1 % quarantaine', '128 000 MAD'],
    ['Tanger Free Zone', '96 lignes', '61 % disponible', '24 % réservé', '7 % bloqué', '88 000 MAD'],
  ],
};
