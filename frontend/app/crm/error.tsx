'use client';

import { WorkspaceRouteError } from '../../features/ux-organization/workspace-route-state';

export default function Error({ reset }: { reset: () => void }) {
  return <WorkspaceRouteError label="Erreur CRM" reset={reset} />;
}

