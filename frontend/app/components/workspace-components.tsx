import type { ReactNode } from 'react';

export type ToastState = {
  tone: 'success' | 'error' | 'info';
  message: string;
} | null;

export function SectionHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <header className="sectionHeader internal">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="headerAction">{action}</div> : null}
    </header>
  );
}

export function WorkspacePanel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="workspacePanel" aria-labelledby={slug(title)}>
      <div className="workspacePanelHeader">
        <div>
          <h2 id={slug(title)}>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function DataTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="tableScroll">
      <table className="denseTable">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, rowIndex) => (
            <tr key={`${row.join('-')}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>
          )) : (
            <tr><td colSpan={columns.length}>Aucune donnée disponible</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function FormField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="formField">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function ActionToast({ toast }: { toast: ToastState }) {
  if (!toast) return null;

  return (
    <p className={`actionToast ${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'} aria-live="polite">
      {toast.message}
    </p>
  );
}

export function StatusBadge({ tone, children }: { tone: 'success' | 'warning' | 'danger' | 'info'; children: ReactNode }) {
  return <span className={`statusBadge ${tone}`}>{children}</span>;
}

export function formatMad(value: number) {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value);
}

function slug(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
