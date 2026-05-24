export default function AdminPage() {
  return (
    <main className="modulePage">
      <h1>Admin SaaS</h1>
      <div className="modules">
        {['Abonnement', 'Feature flags', 'Jobs', 'Backups', 'Support', 'Super-admin'].map((item) => (
          <div className="module" key={item}><strong>{item}</strong><span>Administration tenant, diagnostics et opérations SaaS.</span></div>
        ))}
      </div>
    </main>
  );
}
