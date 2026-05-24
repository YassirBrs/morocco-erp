export default function StockPage() {
  return (
    <main className="modulePage">
      <h1>Stock</h1>
      <div className="modules">
        {['Articles', 'Dépôts', 'Réservations', 'Réceptions', 'Inventaires', 'CUMP'].map((item) => (
          <div className="module" key={item}><strong>{item}</strong><span>Suivi opérationnel par dépôt, article, mouvement et valorisation.</span></div>
        ))}
      </div>
    </main>
  );
}
