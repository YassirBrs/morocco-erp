'use client';

export function WorkspaceRouteLoading({ label = 'Chargement workspace' }: { label?: string }) {
  return (
    <main className="modulePage uxRoutePage">
      <section className="uxPanel uxRouteState">
        <div className="uxSkeleton" aria-label={label} />
        <strong>{label}</strong>
        <span>Préparation des données tenant, permissions, tableaux et indicateurs.</span>
      </section>
    </main>
  );
}

export function WorkspaceRouteError({ label = 'Erreur workspace', reset }: { label?: string; reset?: () => void }) {
  return (
    <main className="modulePage uxRoutePage">
      <section className="uxPanel uxRouteState" role="alert">
        <strong>{label}</strong>
        <span>Impossible de charger cet espace. Les données restent protégées et aucune écriture n’a été lancée.</span>
        {reset ? <button type="button" onClick={() => reset()}>Réessayer</button> : null}
      </section>
    </main>
  );
}

