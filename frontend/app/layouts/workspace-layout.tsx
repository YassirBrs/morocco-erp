'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useMemo, useState } from 'react';

type Session = {
  email: string;
  userName: string;
  role: string;
  tenantId: string;
};

let cachedSession: Session | null | undefined;
let cachedSidebarCollapsed = false;

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
  const [collapsed, setCollapsed] = useState(() => cachedSidebarCollapsed);
  const [session, setSession] = useState<Session | null | undefined>(() => cachedSession);

  useEffect(() => {
    const rawSession = window.localStorage.getItem('morocco-erp-session');
    cachedSession = rawSession ? JSON.parse(rawSession) as Session : null;
    setSession(cachedSession);
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
          <Link className="brandLockup" href="/crm">
            <span className="brandMark">ME</span>
            <span>Morocco ERP</span>
          </Link>
          <button
            type="button"
            className="iconButton"
            aria-label="Réduire la barre latérale"
            onClick={() => setCollapsed((value) => {
              cachedSidebarCollapsed = !value;
              return cachedSidebarCollapsed;
            })}
          >
            {collapsed ? '>' : '<'}
          </button>
        </div>
        <nav>
          {navItems.map(([label, href]) => (
            <Link key={label} href={href} className={label === activeModule ? 'active' : ''}>{label}</Link>
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
