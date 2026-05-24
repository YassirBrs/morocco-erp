export const inventoryWorkflows = {
  reservations: [
    ['CMD-2026-019', 'Rabat Distribution', 'SKU-CHAIR', '18', '9 jours', 'Libération proposée'],
    ['POS-2026-088', 'Boutique Maarif', 'FG-TABLE', '4', '2 jours', 'À conserver'],
  ],
  adjustmentReasons: [
    ['Casse magasin', 'Seuil approbation 5 000 MAD', 'Impact CUMP visible', 'Compte 612 selon PCGE'],
    ['Écart inventaire', 'Validation magasinier + comptable', 'Période ouverte requise', 'Pièce photo attendue'],
    ['Quarantaine', 'Blocage vente automatique', 'Valeur isolée', 'Revue qualité'],
  ],
  counts: [
    ['INV-COUNT-05', 'Dépôt Casablanca', '176 lignes', '8 écarts', 'Approbation requise', 'Résumé posting prêt'],
    ['INV-COUNT-06', 'Dépôt Rabat', '94 lignes', '0 écart', 'À poster', 'Mobile terminé'],
  ],
};

export const accountingWorkspace = {
  accounts: [
    ['342100', 'Clients Maroc', 'Favori', 'Classe 3', 'Autorisé ventes'],
    ['445500', 'TVA collectée', 'Favori', 'Classe 4', 'Déclaration TVA'],
    ['611100', 'Achats marchandises', 'Standard', 'Classe 6', 'Achats stockés'],
  ],
  journals: [
    ['JRN-VENTES-05', 'Ventes mai', '128 lignes', 'Débit = Crédit', 'Comptabilisé'],
    ['OD-2026-008', 'Provision stock', '4 lignes', 'Pièce manquante', 'Brouillon'],
  ],
  vat: [
    ['20 %', '76 200 MAD', '31 900 MAD', '44 300 MAD', '2 exceptions'],
    ['14 %', '8 400 MAD', '2 100 MAD', '6 300 MAD', '0 exception'],
    ['Exonéré', '12 000 MAD', '0 MAD', '0 MAD', 'Mention à vérifier'],
  ],
  closeBlockers: [
    ['Factures brouillon', '7', 'Commercial', 'Bloquant'],
    ['Pièces manquantes', '6', 'Comptable', 'Bloquant'],
    ['Rapprochement bancaire', '14 lignes', 'Trésorerie', 'À finaliser'],
  ],
  bankMatches: [
    ['BMCE 05/2026-112', '18 240 MAD', 'FAC-2026-014', '92 %', 'Match proposé'],
    ['CIH 05/2026-044', '3 600 MAD', 'Frais banque', '68 %', 'Catégorie à confirmer'],
  ],
};

export const payrollWorkspace = {
  employees: [
    ['S-018', 'Nadia El Idrissi', 'CIN BE42188', 'CNSS manquant', '18 000 MAD', 'Audit restreint'],
    ['S-021', 'Karim Berrada', 'CIN A98122', 'CNSS 193847221', '12 500 MAD', 'Contrat CDI'],
  ],
  runPreflight: [
    ['Salariés actifs', '42', 'OK', 'Tous inclus'],
    ['CNSS', '2 anomalies', 'Bloquant', 'Identifiants manquants'],
    ['AMO', 'Base 318 900 MAD', 'OK', 'Non plafonnée'],
    ['IR', 'Tranches calculées', 'OK', '2 personnes à charge'],
  ],
  explanations: [
    ['CNSS', 'Plafond appliqué sur base déclarée', 'Part salariale et patronale séparées'],
    ['AMO', 'Base non plafonnée', 'Écart expliqué dans le bulletin'],
    ['IR', 'Tranche, abattement et personnes à charge', 'Net imposable visible'],
  ],
  damancom: [
    ['Ligne 001', 'Longueur 256', 'OK', 'Checksum archivé'],
    ['Ligne 018', 'Longueur 251', 'Erreur', 'CNSS manquant'],
  ],
  leave: [
    ['Équipe vente', '4 demandes', '1 conflit', 'Impact paie juin'],
    ['Dépôt Casablanca', '2 demandes', '0 conflit', 'Validation manager'],
  ],
  documents: [
    ['CIN', 'Nadia El Idrissi', 'Expire 2027', 'Accès RH restreint', 'Non caviardé'],
    ['Contrat', 'Karim Berrada', 'CDI signé', 'Archive légale', 'Caviardage RIB prêt'],
  ],
};

export const posWorkspace = {
  tickets: [
    ['TCK-2026-088', 'Boutique Maarif', '1 480 MAD', 'Carte', 'Stock déduit', 'Reçu prêt'],
    ['TCK-2026-089', 'Boutique Rabat', '620 MAD', 'Espèces', 'À synchroniser', 'Offline'],
  ],
  closeSession: [
    ['Espèces attendues', '12 460 MAD', 'Comptage caisse', 'Manager requis'],
    ['Espèces comptées', '12 330 MAD', 'Écart -130 MAD', 'Motif obligatoire'],
    ['Carte', '8 900 MAD', 'Rapprochement terminal', 'OK'],
  ],
  refunds: [
    ['TCK-2026-061', 'SKU-CHAIR', 'Défaut', 'Autorisation manager', 'Retour stock + écriture'],
  ],
  offline: [
    ['Terminal POS-02', '3 tickets', '12 min', '0 conflit', 'Rejouer maintenant'],
    ['Terminal POS-04', '1 ticket', '2 h', 'Doublon possible', 'Revue caisse'],
  ],
};

export const adminComplianceWorkspace = {
  users: [
    ['Salma Commercial', 'Commercial', 'Ventes: écrire', 'Remise > 10 % interdite', 'Invitation active'],
    ['Youssef Comptable', 'Comptable', 'Journaux: poster', 'Paie salaires masqués', 'MFA actif'],
    ['Amina Admin', 'Admin', 'Paramètres tenant', 'Conflit rôles surveillé', 'Révocation possible'],
  ],
  numbering: [
    ['Facture', 'FAC-2026', 'FAC-2026-015', 'Verrou après posting', 'Audit requis'],
    ['Avoir', 'AV-2026', 'AV-2026-005', 'Référence facture obligatoire', 'Audit requis'],
    ['BL', 'BL-2026', 'BL-2026-032', 'Annulation tracée', 'Audit requis'],
  ],
  rules: [
    ['MA-2026-VAT', 'TVA 0/7/10/14/20', '2026-01-01', 'Ventes, achats', 'Actif'],
    ['MA-2026-PAY', 'CNSS/AMO/IR', '2026-01-01', 'Paie', 'Actif'],
  ],
  adapters: [
    ['DGI', 'Sandbox', 'Validate/render prêt', 'Identifiants absents', 'Archive preuves active'],
    ['CNSS', 'Sandbox', 'Damancom préflight', 'Soumission live inactive', 'Archive preuves active'],
    ['Banque', 'CSV/OFX', 'Import preview', 'Consentement requis', 'Rapprochement actif'],
  ],
  archive: [
    ['Facture PDF', 'FAC-2026-014', 'sha256:8f42', '10 ans', 'Intègre'],
    ['Damancom', 'PAY-2026-05', 'sha256:9aa1', '10 ans', 'À corriger'],
  ],
  audit: [
    ['24/05/2026 10:12', 'Salma', 'Facture', 'POST', '127.0.0.1', 'FAC-2026-014'],
    ['24/05/2026 11:40', 'Youssef', 'Période', 'LOCK_PREVIEW', '127.0.0.1', '05/2026'],
  ],
  diagnostics: [
    ['API', 'OK', 'p95 112 ms', 'Aucune erreur critique'],
    ['Jobs', 'Queue 3', 'PDF/exports', 'Surveillance'],
    ['Backups', 'Restauration testée', 'RTO 2h', 'Preuve fraîche'],
  ],
};

export const designSystemCatalog = {
  tokens: [
    ['Couleur primaire', '#1E3A8A', 'Actions principales'],
    ['Fond application', '#F8FAFC', 'Surface calme ERP'],
    ['Bordure', '#E2E8F0', 'Tables et panneaux'],
    ['Focus', '#3B82F6', 'Anneau clavier visible'],
    ['Rayon', '8px max', 'Cartes et contrôles'],
  ],
  components: ['Bouton', 'Bouton icône', 'Champ', 'Sélecteur', 'Date picker', 'Table dense', 'Onglets', 'Drawer', 'Modal', 'Timeline'],
  iconBadges: [
    ['VE', 'Ventes'],
    ['AS', 'Achats/Stock'],
    ['CO', 'Comptabilité'],
    ['RH', 'Paie/RH'],
    ['AC', 'Admin/Conformité'],
  ],
  glossary: [
    ['Quote', 'Devis'],
    ['Sales order', 'Commande client'],
    ['Delivery note', 'Bon de livraison'],
    ['Payroll run', 'Run paie'],
    ['Tax filing', 'Télédéclaration'],
    ['Evidence archive', 'Archive légale'],
  ],
  arabicReady: [
    ['Nom arabe', 'Affichage RTL conservé sans basculer toute l’interface'],
    ['Adresse arabe', 'Support factures et relevés bilingues'],
    ['Description article arabe', 'Prévue pour PDF et portail'],
    ['Métadonnées langue document', 'FR principal, AR prêt'],
  ],
  journeys: [
    ['Société de négoce', 'Onboarding → client/article → facture → paiement → TVA'],
    ['Société de services', 'Contrat → facture récurrente → relance → dossier comptable'],
    ['Retail/POS', 'Session caisse → ticket → stock déduit → Z de caisse'],
    ['PME forte paie', 'Salarié → contrat → paie → bulletin → Damancom'],
  ],
};
