export const workflowProductization = {
  importAssistant: {
    steps: ['Téléverser CSV', 'Mapper les champs', 'Prévisualiser erreurs', 'Fusionner doublons', 'Importer et archiver rapport'],
    rows: [
      ['Ligne 12', 'Client', 'ICE manquant', 'Avertissement', 'Créer avec action de correction'],
      ['Ligne 27', 'Article', 'SKU déjà utilisé', 'Doublon', 'Fusion proposée'],
      ['Ligne 44', 'Compte PCGE', 'Classe non autorisée', 'Bloquant', 'Corriger avant import'],
    ],
  },
  exportCenter: [
    ['Pack TVA mai', 'Comptabilité', 'PDF + CSV', 'Terminé', 'sha256:vat0526', '10 ans'],
    ['Balance clients', 'Ventes', 'XLSX', 'En file', 'En attente', '5 ans'],
    ['Damancom mai', 'Paie/RH', 'TXT fixe', 'Erreur', 'Checksum absent', '10 ans'],
  ],
  pdfPreviews: [
    ['Facture', 'FAC-2026-014', 'FR principal · mentions ICE/IF/RC', 'PDF prêt', 'Bilingue AR prêt'],
    ['Bon de livraison', 'BL-2026-031', 'Signature client attendue', 'Aperçu prêt', 'Archive après livraison'],
    ['Bulletin de paie', 'BUL-2026-05-S018', 'Accès RH restreint', 'PDF prêt', 'Données salaire masquées'],
  ],
  emailWorkflow: [
    ['facturation@atlas.ma', 'FAC-2026-014', 'Relance niveau 2', 'Facture + relevé', 'Audit envoyé'],
    ['rh@atlas.ma', 'BUL-2026-05-S018', 'Bulletin de paie', 'PDF bulletin', 'Portail salarié'],
  ],
  attachments: [
    ['DUM import', 'PDF', 'Douane', 'sha256:dum41', '10 ans', 'Classé achat'],
    ['RIB fournisseur', 'Image', 'Banque', 'sha256:rib92', '10 ans', 'Validation KYS'],
    ['Photo réception', 'JPEG', 'Stock', 'sha256:rec12', '5 ans', 'Écart quantité'],
  ],
  timeline: [
    ['24/05 09:10', 'Salma', 'Note', 'Client promet paiement le 30/05', 'FAC-2026-014'],
    ['24/05 10:18', 'Youssef', 'Écriture', 'Journal ventes posté', 'JRN-VENTES-05'],
    ['24/05 11:32', 'Système', 'Export', 'Pack TVA généré avec checksum', 'TVA-05-2026'],
    ['24/05 12:05', 'RH', 'Demande preuve', 'CNSS manquant salarié S-018', 'PAY-2026-05'],
  ],
  taskDrawer: [
    ['Corriger ICE client', 'Salma', 'Aujourd’hui', 'Haute', 'Client Atlas Bureautique', 'Ouverte'],
    ['Valider Damancom', 'Youssef', 'Demain', 'Haute', 'PAY-2026-05', 'En cours'],
    ['Justifier écart caisse', 'Manager POS', 'Aujourd’hui', 'Moyenne', 'Z-2026-05-24', 'Ouverte'],
  ],
  approvals: [
    ['Devis remise', 'DV-2026-022', 'Impact marge -4 200 MAD', 'Règle: remise > 10 %', 'Direction', 'Approuver/Rejeter'],
    ['Ajustement stock', 'ADJ-2026-009', 'Impact CUMP 14 200 MAD', 'Règle: valeur > 10 000 MAD', 'Comptable', 'Commentaire requis'],
    ['Paie', 'PAY-2026-05', 'Net à payer 318 900 MAD', 'Règle: CNSS préflight', 'RH + Comptable', 'Bloqué correction'],
  ],
  relatedRecords: [
    ['FAC-2026-014', 'Client Atlas', 'BL-2026-031', 'JRN-VENTES-05', 'PAYMENT-2026-008', 'PDF facture'],
    ['BC-2026-018', 'Fournitures Nord', 'REC-2026-041', 'FF-2026-078', 'JRN-ACHATS-05', 'Archive preuve'],
  ],
  uxStates: [
    ['Optimistic update', 'Création facture visible immédiatement', 'Rollback si validation DTO backend échoue'],
    ['Unsaved guard', 'Navigation bloquée si formulaire modifié', 'Continuer, annuler ou enregistrer'],
    ['Wizard', 'Onboarding, paie, TVA, inventaire, banque', 'Étapes, préflight et résumé final'],
    ['Performance budget', 'Liste < 120 ms interaction', 'Squelette réservé, pagination et tri serveur'],
    ['Telemetry', 'module_open, create_action, validation_error, export, workflow_completed', 'Tenant + rôle + module'],
  ],
  configurableWidgets: [
    ['Direction', 'Cash, impayés, TVA, approbations', 'Drag order activé', 'Réinitialiser par défaut'],
    ['Comptable', 'Journaux, TVA, pièces, banque', 'Mode dense', 'Export prioritaire'],
    ['Magasinier', 'Réceptions, inventaires, ruptures', 'Mobile scan', 'Alertes stock'],
  ],
  kanbanBoards: [
    ['Prospects CRM', 'Nouveau → Qualifié → Devis → Gagné/Perdu', 'Drag status avec audit'],
    ['Tickets support', 'Nouveau → Analyse → Correction → Résolu', 'SLA visible'],
    ['Tâches internes', 'À faire → En cours → Bloqué → Terminé', 'Assignation utilisateur'],
  ],
  calendars: [
    ['Livraisons', 'Ville, transporteur, promesse client', 'Retards visibles'],
    ['Fiscal', 'TVA, IR, CNSS, IS', 'Preuve et responsable'],
    ['Congés', 'Équipe, solde, conflit', 'Impact paie'],
    ['Maintenance', 'Actif, technicien, pièce', 'Récurrence'],
  ],
  editableGrids: [
    ['Lignes devis/facture', 'Article, quantité, TVA, remise', 'Validation cellule'],
    ['Lignes inventaire', 'Compté, théorique, écart, motif', 'Mobile friendly'],
    ['Lignes journal', 'Compte, débit, crédit, analytique', 'Balance live'],
  ],
  aiSuggestions: [
    ['Relancer FAC-2026-014', 'Promesse paiement proche et historique fiable', 'Humain valide avant envoi'],
    ['Créer DA pour SKU-CHAIR', 'Stock sous seuil et fournisseur préféré actif', 'Audit suggestion conservé'],
    ['Corriger CNSS S-018', 'Bloque Damancom', 'Assigné RH'],
  ],
  competitorScorecard: [
    ['Navigation', '5 espaces clairs, recherche globale, raccourcis', 'Comparable Odoo, plus localisé Maroc'],
    ['Vitesse workflow', 'Devis → BL → facture → paiement en actions guidées', 'Meilleur que fichiers Excel/Sage isolé'],
    ['Densité données', 'Tables triées, filtres, colonnes, pagination', 'Mode comptable dense'],
    ['Qualité document', 'PDF, mentions légales, checksum, bilingue prêt', 'Preuve légale intégrée'],
    ['Confiance comptable', 'PCGE, TVA, périodes, audit, pièces', 'Aligné cabinet marocain'],
  ],
  journeyMaps: [
    ['Négoce marocain', 'Onboarding légal → client/article → première facture → paiement → rapport TVA'],
    ['Services', 'Contrat → récurrent → facture → relance → pack expert-comptable'],
    ['Retail', 'Session POS → ticket → stock déduit → Z report → journal caisse'],
    ['PME paie forte', 'Salarié → contrat → run paie → bulletin → Damancom → archive'],
  ],
  informationArchitecture: [
    ['Ventes', 'CRM, devis, commandes, BL, factures, paiements, relances', 'Encaisser plus vite'],
    ['Achats/Stock', 'Fournisseurs, commandes, réceptions, factures, stocks, inventaires', 'Sécuriser disponibilité et CUMP'],
    ['Comptabilité', 'PCGE, journaux, TVA, périodes, banque, preuves', 'Clôturer sans surprise'],
    ['Paie/RH', 'Salariés, contrats, paie, bulletins, Damancom, congés', 'Payer correctement et déclarer'],
    ['Admin/Conformité', 'Tenant, rôles, numérotation, adaptateurs, audit, archives', 'Piloter contrôle et conformité'],
  ],
};
