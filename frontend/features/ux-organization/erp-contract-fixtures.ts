export const uxContractShowcase = {
  kpis: [
    { label: 'Contrats API', value: '15', trend: 'List/detail/form/action couverts', status: 'ok' as const },
    { label: 'Vues sauvegardées', value: '8', trend: 'Filtres + colonnes persistés', status: 'info' as const },
    { label: 'Jobs documents', value: '11', trend: 'Exports, imports, PDF, envois', status: 'warning' as const },
    { label: 'Smoke workspaces', value: '5/5', trend: 'Ventes à Paie couverts', status: 'ok' as const },
  ],
  listRows: [
    ['FAC-2026-014', 'Atlas Bureautique SARL', 'Comptabilisée', '86 400 MAD', 'Solde 18 240 MAD'],
    ['DEV-2026-022', 'Rabat Services', 'Approbation requise', '64 000 MAD', 'Remise > seuil'],
    ['BC-2026-018', 'Fournitures Nord', 'Réception partielle', '42 800 MAD', 'CUMP à valider'],
  ],
  detailTimeline: [
    ['09:10', 'Salma Commercial', 'Note', 'Relance client planifiée avec prochaine action'],
    ['10:18', 'Youssef Comptable', 'Écriture', 'Journal vente équilibré et preuve PDF liée'],
    ['11:32', 'Système', 'Export', 'Checksum archivé selon rétention 10 ans'],
  ],
  formFields: [
    ['customer.ice', 'ICE', 'ICE_15_DIGITS', 'Obligatoire pour facture marocaine'],
    ['customer.ifNumber', 'IF', 'IF_NUMERIC', 'Identifiant fiscal du tiers'],
    ['lines[].vatRate', 'TVA', 'VAT_ALLOWED_RATE', '0 %, 7 %, 10 %, 14 %, 20 %'],
    ['period', 'Période fiscale', 'FISCAL_PERIOD_OPEN', 'Refuser si verrouillée'],
  ] as Array<[string, string, string, string]>,
  validationRows: [
    ['customer.ice', 'Erreur', 'ICE obligatoire pour les documents marocains', 'Saisir ICE à 15 chiffres'],
    ['lines[0].vatRate', 'Erreur', 'Taux TVA marocain non autorisé', 'Utiliser les taux officiels configurés'],
    ['period', 'Bloquant', 'Période fiscale verrouillée', 'Demander exception approuvée'],
  ],
  exportRows: [
    ['exp-vat-2026-05', 'Terminé', 'tva-mai-2026.zip', 'sha256:vat0526', '31/05/2036'],
    ['exp-balance-clients', 'En cours', 'balance-clients.xlsx', 'En calcul', '31/05/2031'],
    ['exp-damancom', 'Échec', 'damancom-mai.txt', 'CNSS manquant', '31/05/2036'],
  ],
  importRows: [
    ['imp-customers-1', 'Prévisualisation', 'ICE -> ice, Nom -> name', '1 erreur', '2 doublons'],
    ['imp-products-1', 'Terminé', 'SKU -> sku, Prix -> salePrice', '34 créés', '0 échec'],
  ],
  sendRows: [
    ['FAC-2026-014', 'Email', 'Envoyé', 'facturation@atlas.ma', 'MAIL-014'],
    ['FAC-2026-014', 'Portail client', 'Visible', 'Atlas Bureautique', 'PORTAL-014'],
    ['BC-2026-018', 'Portail fournisseur', 'En attente', 'Fournitures Nord', 'PORTAL-SUP-018'],
    ['BL-2026-031', 'Téléchargement manuel', 'Téléchargé', 'Magasin Casablanca', 'DL-031'],
  ],
  pdfRows: [
    ['FAC-2026-014', 'invoice-ma-v4', 'FR', 'sha256:fac014', 'ICE, IF, RC, Patente, TVA'],
    ['BUL-2026-05-S018', 'payslip-ma-v2', 'FR + AR ready', 'sha256:bul018', 'CNSS, AMO, IR, Net à payer'],
  ],
  smokeFlows: [
    ['Sales', 'Créer client -> devis -> approbation -> commande -> BL -> facture -> paiement partiel', 'Couvert'],
    ['Purchases', 'Fournisseur -> commande achat -> réception -> facture fournisseur -> calendrier paiement', 'Couvert'],
    ['Inventory', 'Article -> stock dépôt -> réservation -> transfert -> ajustement -> inventaire', 'Couvert'],
    ['Accounting', 'Journal -> TVA -> verrou période -> rapprochement banque -> preuve légale', 'Couvert'],
    ['Payroll', 'Salarié -> contrat -> run paie -> bulletin -> Damancom -> préflight CNSS', 'Couvert'],
  ],
};
