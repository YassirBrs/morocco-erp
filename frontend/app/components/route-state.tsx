export function WorkspaceRouteLoading({ label = 'espace ERP' }: { label?: string }) {
  return (
    <main className="workspaceGate">
      <section className="authRequiredPanel" role="status" aria-live="polite">
        <span className="brandMark">ME</span>
        <p className="eyebrow">Chargement</p>
        <h1>Préparation de {label}</h1>
        <p>Les contrôles, tableaux et actions sécurisées sont en cours de chargement.</p>
      </section>
    </main>
  );
}

export function WorkspaceRouteError({ error, label = 'Erreur espace ERP', reset }: { error?: Error; label?: string; reset?: () => void }) {
  return (
    <main className="workspaceGate">
      <section className="authRequiredPanel" role="alert">
        <span className="brandMark">ME</span>
        <p className="eyebrow">{label}</p>
        <h1>Impossible d’ouvrir cet espace ERP.</h1>
        <p>{error?.message ?? 'Rechargez la vue ou revenez au module principal.'}</p>
        {reset ? <button type="button" onClick={reset}>Réessayer</button> : <a className="primaryLink" href="/crm">Retour CRM</a>}
      </section>
    </main>
  );
}
