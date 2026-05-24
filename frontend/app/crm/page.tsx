export default function CrmPage() {
  return (
    <main className="modulePage">
      <h1>CRM</h1>
      <div className="modules">
        {['Clients', 'Prospects', 'Relances', 'Recherche', 'Documents', 'Risque'].map((item) => (
          <div className="module" key={item}><strong>{item}</strong><span>Workflow complet avec données tenant et conformité Maroc.</span></div>
        ))}
      </div>
    </main>
  );
}
