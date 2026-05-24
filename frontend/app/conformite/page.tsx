export default function ConformitePage() {
  return (
    <main className="modulePage">
      <h1>Conformité</h1>
      <div className="modules">
        {['TVA', 'DGI', 'CNSS', 'Mentions facture', 'Archives', 'Calendrier'].map((item) => (
          <div className="module" key={item}><strong>{item}</strong><span>Règles versionnées Maroc et dossiers de preuve.</span></div>
        ))}
      </div>
    </main>
  );
}
