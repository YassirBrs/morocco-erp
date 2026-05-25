'use client';

import { WorkspaceRouteError } from '../components/route-state';

export default function Error({ reset }: { reset: () => void }) {
  return <WorkspaceRouteError label="Erreur qualité et migration" reset={reset} />;
}
