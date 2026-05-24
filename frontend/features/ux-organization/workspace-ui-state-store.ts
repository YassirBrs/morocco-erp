export type WorkspaceRouteKey = 'sales' | 'purchases' | 'inventory' | 'accounting' | 'payroll' | 'pos' | 'admin';

export const workspaceRouteStructure: Array<{
  key: WorkspaceRouteKey;
  labelFr: string;
  primaryPath: string;
  aliases: string[];
  roles: string[];
}> = [
  { key: 'sales', labelFr: 'Ventes', primaryPath: '/ventes', aliases: ['/sales', '/crm'], roles: ['OWNER', 'SALES', 'ACCOUNTANT'] },
  { key: 'purchases', labelFr: 'Achats', primaryPath: '/achats-stock', aliases: ['/purchases'], roles: ['OWNER', 'WAREHOUSE', 'ACCOUNTANT'] },
  { key: 'inventory', labelFr: 'Stock', primaryPath: '/stock', aliases: ['/inventory', '/achats-stock'], roles: ['OWNER', 'WAREHOUSE'] },
  { key: 'accounting', labelFr: 'Comptabilité', primaryPath: '/comptabilite', aliases: ['/accounting'], roles: ['OWNER', 'ACCOUNTANT'] },
  { key: 'payroll', labelFr: 'Paie/RH', primaryPath: '/paie', aliases: ['/payroll'], roles: ['OWNER', 'PAYROLL', 'ACCOUNTANT'] },
  { key: 'pos', labelFr: 'POS', primaryPath: '/pos', aliases: ['/cashier'], roles: ['OWNER', 'CASHIER'] },
  { key: 'admin', labelFr: 'Admin/Conformité', primaryPath: '/admin', aliases: ['/conformite', '/settings'], roles: ['OWNER', 'ADMIN'] },
];

export const workspaceUiStateStore = {
  currentTenant: {
    id: 'tenant-demo',
    tradeName: 'Atlas Distribution SARL',
    country: 'MA',
    currency: 'MAD',
    mainLanguage: 'fr',
  },
  role: 'OWNER',
  workspace: {
    key: 'ux-contracts',
    path: '/contrats-ux',
    breadcrumbs: ['Accueil', 'Socle UX', 'Contrats API'],
  },
  pinnedModules: ['Ventes', 'Achats/Stock', 'Comptabilité', 'Paie/RH', 'Workflows'],
  notifications: {
    total: 12,
    danger: 3,
    warning: 7,
    info: 2,
  },
  recentRecords: ['FAC-2026-014', 'BC-2026-018', 'PAY-2026-05', 'TVA-2026-05'],
};

export const keyboardShortcutRegistry = [
  { keys: 'Ctrl+K', labelFr: 'Ouvrir commande globale', scope: 'global', conflict: false },
  { keys: 'Ctrl+S', labelFr: 'Enregistrer formulaire', scope: 'form', conflict: false },
  { keys: 'Alt+N', labelFr: 'Créer enregistrement', scope: 'workspace', conflict: false },
  { keys: 'Alt+E', labelFr: 'Exporter liste', scope: 'list', conflict: false },
];

