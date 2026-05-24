export default function PaiePage() {
  return (
    <main className="modulePage">
      <h1>Paie</h1>
      <div className="modules">
        {['Salariés', 'Contrats', 'Congés', 'Runs paie', 'Bulletins', 'Damancom'].map((item) => (
          <div className="module" key={item}><strong>{item}</strong><span>Paie Maroc avec CNSS, AMO, IR, exports et commentaires.</span></div>
        ))}
      </div>
    </main>
  );
}
