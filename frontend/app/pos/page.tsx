export default function PosPage() {
  return (
    <main className="modulePage">
      <h1>POS</h1>
      <div className="modules">
        {['Sessions', 'Tickets', 'Paiements', 'Z caisse', 'Transferts', 'Sync offline'].map((item) => (
          <div className="module" key={item}><strong>{item}</strong><span>Encaissement, rapprochement caisse et synchronisation stock.</span></div>
        ))}
      </div>
    </main>
  );
}
