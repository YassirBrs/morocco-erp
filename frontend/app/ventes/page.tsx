export default function VentesPage() {
  return <ModulePage title="Ventes" items={['Devis', 'Commandes', 'Livraisons', 'Factures', 'Avoirs', 'Relances']} />;
}

function ModulePage({ title, items }: { title: string; items: string[] }) {
  return (
    <main className="modulePage">
      <h1>{title}</h1>
      <div className="modules">{items.map((item) => <div className="module" key={item}><strong>{item}</strong><span>Liste, détail, création, validation et export.</span></div>)}</div>
    </main>
  );
}
