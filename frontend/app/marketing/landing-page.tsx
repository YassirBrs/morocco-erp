const modules = [
  ['CRM et ventes', 'Pipeline commercial, devis, commandes, BL, factures, avoirs et relances clients.'],
  ['Achats et stock', 'Fournisseurs, commandes achat, réceptions, dépôts, CUMP et alertes de réapprovisionnement.'],
  ['Comptabilité Maroc', 'PCGE, Journal Comptable, TVA, rapprochement, preuves et Clôture de période.'],
  ['Paie et RH', 'Contrats, Bulletins de paie, CNSS, AMO, IR et préparation Damancom.'],
];

const compliance = [
  'ICE, IF, RC, Patente et CNSS suivis par tenant',
  'Séries de facturation et mentions légales marocaines',
  'Packs de règles TVA, IR, CNSS et AMO versionnés',
  'Exports comptables, TVA, Damancom et dossiers de preuves',
];

const pricing = [
  {
    name: 'Starter',
    price: '490 MAD',
    description: 'Pour petites équipes qui veulent structurer ventes, stock et facturation.',
    features: ['CRM', 'Factures Maroc', 'Stock simple', 'Support standard'],
  },
  {
    name: 'Professional',
    price: '1 490 MAD',
    description: 'Pour PME avec comptabilité, paie et contrôles de gestion.',
    features: ['Comptabilité PCGE', 'Paie Maroc', 'Rôles avancés', 'Exports réglementaires'],
  },
  {
    name: 'Enterprise',
    price: 'Sur devis',
    description: 'Pour groupes multi-sites, cabinets comptables et exigences auditables.',
    features: ['Multi-tenant', 'Portails', 'SLA support', 'Accompagnement conformité'],
  },
];

export function MarketingLandingPage() {
  return (
    <main className="marketingPage">
      <header className="marketingNav">
        <a className="brandLockup" href="/" aria-label="Morocco ERP accueil">
          <span className="brandMark">ME</span>
          <span>Morocco ERP</span>
        </a>
        <nav aria-label="Navigation publique">
          <a href="#modules">Modules</a>
          <a href="#conformite">Conformité</a>
          <a href="#tarifs">Tarifs</a>
          <a className="navButton" href="/auth/login">Se connecter</a>
        </nav>
      </header>

      <section className="marketingHero">
        <div className="heroCopy">
          <p className="eyebrow">ERP SaaS pour entreprises marocaines</p>
          <h1>Un système de gestion clair, conforme et prêt pour la croissance.</h1>
          <p>
            Centralisez ventes, achats, stock, comptabilité, paie et conformité dans une
            plateforme française-first pensée pour les PME marocaines et leurs experts-comptables.
          </p>
          <div className="heroActions">
            <a className="primaryLink" href="/auth/login">Démarrer l’espace sécurisé</a>
            <a className="secondaryLink" href="#tarifs">Voir les prix MAD</a>
          </div>
        </div>
        <div className="heroSystem" aria-label="Aperçu opérationnel Morocco ERP">
          <div className="systemTopline">
            <span>Atlas Distribution SARL</span>
            <strong>Conformité MA-2026</strong>
          </div>
          <div className="systemMetrics">
            <span><strong>570 000 MAD</strong> Chiffre facturé</span>
            <span><strong>42</strong> Écritures Journal Comptable</span>
            <span><strong>6</strong> Contrôles Clôture de période</span>
          </div>
          <div className="systemFlow">
            <span>Devis</span>
            <span>Facture</span>
            <span>Paiement</span>
            <span>Journal</span>
          </div>
        </div>
      </section>

      <section id="modules" className="publicSection">
        <div className="sectionHeader">
          <p className="eyebrow">Modules ERP</p>
          <h2>Chaque domaine a son propre espace de travail.</h2>
          <p>Pas de tableau de bord fourre-tout: chaque équipe accède à des vues ciblées, rapides et auditables.</p>
        </div>
        <div className="moduleGrid">
          {modules.map(([title, body]) => (
            <article key={title} className="publicCard">
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="conformite" className="publicSection complianceBand">
        <div className="sectionHeader">
          <p className="eyebrow">Avantage conformité</p>
          <h2>Conçu pour les obligations marocaines dès le départ.</h2>
        </div>
        <ul className="complianceList">
          {compliance.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section id="tarifs" className="publicSection">
        <div className="sectionHeader">
          <p className="eyebrow">Tarifs mensuels HT</p>
          <h2>Choisissez le périmètre qui correspond à votre entreprise.</h2>
        </div>
        <div className="pricingGrid">
          {pricing.map((plan) => (
            <article key={plan.name} className="pricingCard">
              <div>
                <h3>{plan.name}</h3>
                <strong>{plan.price}</strong>
                <p>{plan.description}</p>
              </div>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <a href="/auth/login">Choisir {plan.name}</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
