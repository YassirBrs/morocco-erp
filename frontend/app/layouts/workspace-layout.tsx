'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

type Session = {
  email: string;
  userName: string;
  role: string;
  tenantId: string;
};

const navItems = [
  ['CRM', '/crm'],
  ['Factures', '/sales'],
  ['Fournisseurs', '/purchases'],
  ['Paie', '/payroll'],
  ['Comptabilité', '/comptabilite'],
  ['Stock', '/stock'],
  ['POS', '/pos'],
  ['Workflows', '/workflows'],
  ['Qualité', '/qualite-migration'],
  ['Admin', '/admin'],
  ['Conformité', '/conformite'],
  ['Contrats UX', '/contrats-ux'],
];

export function WorkspaceLayout({ activeModule, children }: { activeModule: string; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const rawSession = window.localStorage.getItem('morocco-erp-session');
    setSession(rawSession ? JSON.parse(rawSession) as Session : null);
  }, []);

  const activeLabel = useMemo(() => navItems.find(([label]) => label === activeModule)?.[0] ?? activeModule, [activeModule]);

  if (session === undefined) {
    return <main className="workspaceGate"><p>Vérification de la session sécurisée...</p></main>;
  }

  if (!session) {
    return (
      <main className="workspaceGate">
        <section className="authRequiredPanel">
          <span className="brandMark">ME</span>
          <p className="eyebrow">Session requise</p>
          <h1>Connectez-vous pour accéder à {activeLabel}.</h1>
          <p>Les données internes, journaux, factures et Bulletins de paie ne sont jamais affichés sur l’espace public.</p>
          <a className="primaryLink" href="/auth/login">Ouvrir une session</a>
        </section>
      </main>
    );
  }

  return (
    <main className={`workspaceShell ${collapsed ? 'collapsed' : ''}`}>
      <aside className="workspaceSidebar" aria-label="Navigation ERP">
        <div className="sidebarHeader">
          <a className="brandLockup" href="/crm">
            <span className="brandMark">ME</span>
            <span>Morocco ERP</span>
          </a>
          <button type="button" className="iconButton" aria-label="Réduire la barre latérale" onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? '>' : '<'}
          </button>
        </div>
        <nav>
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className={label === activeModule ? 'active' : ''}>{label}</a>
          ))}
        </nav>
        <div className="sessionCard">
          <span>{session.role}</span>
          <strong>{session.userName}</strong>
          <small>{session.tenantId}</small>
        </div>
      </aside>
      <section className="workspaceContent">{children}</section>
    </main>
  );
}
