import type React from 'react';

import type { StatusStep, TableColumn, TableRow, WorkspaceStatus } from './erp-workspace-fixtures';

export function statusClass(status: WorkspaceStatus | string = 'info') {
  return `uxStatus uxStatus-${status}`;
}

export function WorkspaceHeader({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryAction: string;
  secondaryAction?: string;
}) {
  return (
    <header className="uxWorkspaceHeader">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="uxHeaderActions">
        {secondaryAction ? <button className="uxSecondaryButton" type="button">{secondaryAction}</button> : null}
        <button type="button">{primaryAction}</button>
      </div>
    </header>
  );
}

export function WorkspaceTabs({ tabs, active = 0 }: { tabs: string[]; active?: number }) {
  return (
    <div className="uxTabs" role="tablist" aria-label="Onglets de l'espace de travail">
      {tabs.map((tab, index) => (
        <button key={tab} role="tab" type="button" aria-selected={index === active} className={index === active ? 'active' : ''}>
          {tab}
        </button>
      ))}
    </div>
  );
}

export function KpiStrip({
  items,
}: {
  items: Array<{ label: string; value: string; trend: string; status: WorkspaceStatus }>;
}) {
  return (
    <section className="uxKpiStrip" aria-label="Indicateurs clés">
      {items.map((item) => (
        <article key={item.label} className="uxKpiCard">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <em className={statusClass(item.status)}>{item.trend}</em>
        </article>
      ))}
    </section>
  );
}

export function DenseDataTable({
  title,
  columns,
  rows,
  emptyAction = 'Créer un enregistrement',
}: {
  title: string;
  columns: TableColumn[];
  rows: TableRow[];
  emptyAction?: string;
}) {
  return (
    <section className="uxPanel">
      <div className="uxPanelHeader">
        <div>
          <h2>{title}</h2>
          <p>Recherche, filtres, tri, pagination, colonnes, export et actions groupées.</p>
        </div>
        <div className="uxToolbar" aria-label={`Actions ${title}`}>
          <input aria-label={`Rechercher dans ${title}`} placeholder="Rechercher ICE, numéro, libellé..." />
          <button className="uxSecondaryButton" type="button">Filtres</button>
          <button className="uxSecondaryButton" type="button">Colonnes</button>
          <button type="button">Exporter</button>
        </div>
      </div>
      {rows.length ? (
        <>
          <div className="tableScroll">
            <table className="uxDenseTable">
              <thead>
                <tr>
                  <th scope="col"><input aria-label={`Tout sélectionner dans ${title}`} type="checkbox" /></th>
                  {columns.map((column) => (
                    <th key={column.label} scope="col" className={column.numeric ? 'numeric' : undefined}>
                      {column.sortable ? <button className="uxSortButton" type="button">Trier {column.label}</button> : column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${title}-${index}`}>
                    <td><input aria-label={`Sélectionner ligne ${index + 1} de ${title}`} type="checkbox" /></td>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`} className={columns[cellIndex]?.numeric ? 'numeric' : undefined}>
                        {cellIndex === row.cells.length - 1 && row.status ? <span className={statusClass(row.status)}>{cell}</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="uxTableFooter">
            <span>{rows.length} lignes affichées · page 1 sur 1</span>
            <div>
              <button className="uxSecondaryButton" type="button" disabled>Précédent</button>
              <button className="uxSecondaryButton" type="button">Suivant</button>
            </div>
          </footer>
        </>
      ) : (
        <EmptyState title={`Aucun élément dans ${title}`} detail="Les utilisateurs voient une action claire au lieu d'une table vide." action={emptyAction} />
      )}
      <div className="uxBulkBar" role="status">
        Actions groupées disponibles: exporter, archiver, demander validation, assigner responsable.
      </div>
    </section>
  );
}

export function StatusPipeline({ title, steps }: { title: string; steps: StatusStep[] }) {
  return (
    <section className="uxPanel">
      <div className="uxPanelHeader compact">
        <h2>{title}</h2>
      </div>
      <ol className="uxPipeline" aria-label={title}>
        {steps.map((step) => (
          <li key={step.label} className={`uxPipelineStep ${step.state}`}>
            <span>{step.label}</span>
            <small>{step.state === 'done' ? 'Terminé' : step.state === 'current' ? 'En cours' : step.state === 'blocked' ? 'Bloqué' : 'À venir'}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RecordDetailStandard({
  title,
  status,
  meta,
  children,
}: {
  title: string;
  status: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <section className="uxPanel">
      <div className="uxRecordHeader">
        <div>
          <p className="eyebrow">Fiche détail standardisée</p>
          <h2>{title}</h2>
          <p>{meta}</p>
        </div>
        <div className="uxHeaderActions">
          <span className={statusClass(status.includes('requise') || status.includes('Échue') ? 'warning' : 'info')}>{status}</span>
          <button type="button">Action principale</button>
          <button className="uxSecondaryButton" type="button">Actions</button>
        </div>
      </div>
      {children}
      <div className="uxRecordFooter">
        <button className="uxSecondaryButton" type="button">Ouvrir timeline</button>
        <button className="uxSecondaryButton" type="button">Audit</button>
        <button className="uxSecondaryButton" type="button">Joindre preuve</button>
      </div>
    </section>
  );
}

export function FormValidationCard() {
  const fields = [
    ['Client', 'Obligatoire avant création du devis'],
    ['ICE', 'Format marocain attendu pour les documents légaux'],
    ['Taux TVA', 'Autorisé: 0 %, 7 %, 10 %, 14 %, 20 %'],
    ['Période fiscale', 'Impossible de poster si la période est verrouillée'],
  ];

  return (
    <section className="uxPanel">
      <div className="uxPanelHeader">
        <div>
          <h2>Formulaire create/edit standard</h2>
          <p>Sections groupées, validation inline, sauvegarde clavier et garde-fou modifications non enregistrées.</p>
        </div>
        <button type="button">Enregistrer</button>
      </div>
      <form className="uxFormGrid" aria-label="Formulaire de validation ERP">
        {fields.map(([label, helper]) => (
          <label key={label}>
            <span>{label} *</span>
            <input aria-describedby={`${label}-help`} defaultValue={label === 'Taux TVA' ? '20 %' : ''} />
            <small id={`${label}-help`}>{helper}</small>
          </label>
        ))}
      </form>
      <div className="uxValidationSummary" role="alert">
        Validation DTO: le client est obligatoire, le taux TVA doit être marocain, la période fiscale ne doit pas être verrouillée.
      </div>
      <footer className="uxStickyFooter">
        <span>Modifications non enregistrées détectées</span>
        <button className="uxSecondaryButton" type="button">Annuler</button>
        <button type="button">Enregistrer avec Ctrl+S</button>
      </footer>
    </section>
  );
}

export function NextStepActions({ actions }: { actions: string[] }) {
  return (
    <section className="uxPanel">
      <div className="uxPanelHeader compact">
        <h2>Prochaines actions contextuelles</h2>
      </div>
      <div className="uxActionGrid">
        {actions.map((action, index) => (
          <button key={action} type="button" className={index === 0 ? '' : 'uxSecondaryButton'}>{action}</button>
        ))}
      </div>
    </section>
  );
}

export function PreviewSidePanels() {
  const previews = [
    ['Client', 'Atlas Bureautique SARL', 'ICE 001525874000033 · Solde 18 240 MAD'],
    ['Fournisseur', 'Fournitures Nord', 'RIB validé · score 92/100'],
    ['Facture', 'FAC-2026-014', 'TVA 20 % · échéance dépassée'],
    ['Article', 'SKU-CHAIR', '50 en stock · 18 réservés'],
  ];

  return (
    <section className="uxPanel">
      <div className="uxPanelHeader compact">
        <h2>Panneaux de prévisualisation</h2>
      </div>
      <div className="uxPreviewGrid">
        {previews.map(([type, title, detail]) => (
          <article key={title}>
            <span>{type}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
            <button className="uxSecondaryButton" type="button">Inspecter sans quitter la liste</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function QuickCreateModals() {
  const entities = ['Client', 'Fournisseur', 'Article', 'Salarié', 'Dépôt', 'Compte journal'];
  return (
    <section className="uxPanel">
      <div className="uxPanelHeader compact">
        <h2>Création rapide liée</h2>
      </div>
      <div className="uxActionGrid">
        {entities.map((entity) => (
          <button key={entity} className="uxSecondaryButton" type="button">Créer {entity}</button>
        ))}
      </div>
    </section>
  );
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action: string }) {
  return (
    <div className="uxEmptyState">
      <strong>{title}</strong>
      <p>{detail}</p>
      <button type="button">{action}</button>
    </div>
  );
}

export function FeedbackStates() {
  return (
    <section className="uxPanel">
      <div className="uxPanelHeader compact">
        <h2>États UX normalisés</h2>
      </div>
      <div className="uxStateGrid">
        <div className="uxSkeleton" aria-label="Chargement squelette" />
        <EmptyState title="Aucune facture trouvée" detail="Créez une facture ou ajustez les filtres." action="Créer facture" />
        <div className="uxFeedback danger" role="alert">Erreur: le backend refuse la TVA hors règles marocaines. Corrigez le taux ou choisissez une exemption.</div>
        <div className="uxFeedback ok" role="status">Succès: FAC-2026-014 comptabilisée. Ouvrir la facture ou préparer l'email.</div>
        <div className="uxFeedback warning" role="status">Accès limité: votre rôle permet la lecture, mais pas la validation.</div>
      </div>
    </section>
  );
}

export function AccessibilityChecklist() {
  const items = [
    'Libellés aria sur recherche, filtres, actions et cases de sélection',
    'Focus visible sur boutons, liens, onglets et champs',
    'Ordre de tabulation aligné sur la hiérarchie visuelle',
    'Noms d’écran lecteurs pour navigation, tables et panneaux',
    'Cibles tactiles de 44 px minimum pour les contrôles critiques',
  ];

  return (
    <section className="uxPanel">
      <div className="uxPanelHeader compact">
        <h2>Accessibilité ERP</h2>
      </div>
      <ul className="uxChecklist">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export function UxStatusPill({ status, children }: { status: WorkspaceStatus | string; children: React.ReactNode }) {
  return <span className={statusClass(status)}>{children}</span>;
}

export function ReusableWorkspaceHeader({
  title,
  subtitle,
  kpis,
  primaryAction,
  secondaryAction,
}: {
  title: string;
  subtitle: string;
  kpis: Array<{ label: string; value: string; trend: string; status: WorkspaceStatus }>;
  primaryAction: string;
  secondaryAction?: string;
}) {
  return (
    <>
      <WorkspaceHeader eyebrow="Socle composant ERP" title={title} subtitle={subtitle} primaryAction={primaryAction} secondaryAction={secondaryAction} />
      <KpiStrip items={kpis} />
    </>
  );
}

export function ReusableListPage({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: TableColumn[];
  rows: TableRow[];
}) {
  return <DenseDataTable title={title} columns={columns} rows={rows} emptyAction="Créer vue" />;
}

export function ReusableRecordPage({ title, status, children }: { title: string; status: string; children: React.ReactNode }) {
  return (
    <RecordDetailStandard title={title} status={status} meta="Header, statut, actions autorisées, onglets, timeline et audit résumé.">
      <WorkspaceTabs tabs={['Résumé', 'Lignes', 'Paiements', 'Écritures', 'Documents', 'Audit']} active={0} />
      {children}
    </RecordDetailStandard>
  );
}

export function ReusableFormPage({ fields }: { fields: Array<[string, string, string, string]> }) {
  return (
    <section className="uxPanel">
      <div className="uxPanelHeader">
        <div>
          <h2>Form page dynamique</h2>
          <p>Sections, champs requis dynamiques, règles marocaines, aide inline, résumé d’erreurs et footer sticky.</p>
        </div>
        <button type="button">Enregistrer</button>
      </div>
      <div className="uxFormGrid">
        {fields.map(([path, label, rule, helper]) => (
          <label key={path}>
            <span>{label} *</span>
            <input defaultValue={path.includes('vat') ? '20 %' : ''} aria-describedby={`${path}-helper`} />
            <small id={`${path}-helper`}>{rule} · {helper}</small>
          </label>
        ))}
      </div>
      <div className="uxValidationSummary" role="alert">Résumé validation: ICE, IF, TVA et période fiscale contrôlés avant sauvegarde.</div>
      <footer className="uxStickyFooter">
        <span>Sauvegarde disponible avec Ctrl+S</span>
        <button className="uxSecondaryButton" type="button">Annuler</button>
        <button type="button">Enregistrer</button>
      </footer>
    </section>
  );
}

export function ApprovalBanner() {
  return (
    <div className="uxApprovalBanner" role="status">
      <strong>Approbation manager requise</strong>
      <span>Remise supérieure à 10 %, reviewer Nadia Benali, SLA 8 h.</span>
      <button type="button">Ouvrir décision</button>
    </div>
  );
}

export function FinancialTotalsPanel() {
  const rows = [
    ['Sous-total', '72 000 MAD'],
    ['TVA 20 %', '14 400 MAD'],
    ['Total TTC', '86 400 MAD'],
    ['Payé', '68 160 MAD'],
    ['Solde', '18 240 MAD'],
  ];
  return (
    <section className="uxTotalsPanel" aria-label="Totaux financiers">
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}

export function LegalIdentityPanel() {
  const rows = ['ICE 001525678000083', 'IF 1525678', 'RC CASA-425001', 'Patente 34218811', 'CNSS 1234567', 'Casablanca · TVA active'];
  return (
    <section className="uxIdentityGrid" aria-label="Identité légale Maroc">
      {rows.map((row) => <span key={row}>{row}</span>)}
    </section>
  );
}

export function DocumentEvidencePanel() {
  const rows = ['PDF facture · sha256:fac014 · 10 ans', 'Damancom TXT · sha256:cnss0526 · 10 ans', 'Photo réception · sha256:rec12 · 5 ans'];
  return (
    <section className="uxEvidencePanel" aria-label="Preuves documentaires">
      {rows.map((row) => <span key={row}>{row}</span>)}
    </section>
  );
}

export function MoroccanValidationPanel() {
  const rules = ['ICE', 'IF', 'RC', 'Patente', 'CNSS', 'CIN', 'RIB', 'Taux TVA', 'Période fiscale'];
  return (
    <section className="uxValidationChips" aria-label="Validateurs Maroc">
      {rules.map((rule) => <UxStatusPill key={rule} status="info">{rule}</UxStatusPill>)}
    </section>
  );
}

export function AuditDrawer() {
  return (
    <aside className="uxAuditDrawer" aria-label="Tiroir audit">
      <h2>Audit filtré</h2>
      <span>Acteur: Youssef Comptable</span>
      <span>Champs modifiés: statut, journal, preuve</span>
      <span>Horodatage: 24/05/2026 10:18</span>
      <span>IP source: 196.12.44.18</span>
    </aside>
  );
}

export function TimelineComposer() {
  return (
    <section className="uxTimelineComposer">
      <h2>Composer note, tâche, commentaire, envoi document ou demande de preuve</h2>
      <textarea defaultValue="Relancer le client et joindre le relevé signé." />
      <div className="uxActionGrid">
        <button type="button">Note</button>
        <button className="uxSecondaryButton" type="button">Tâche</button>
        <button className="uxSecondaryButton" type="button">Demande preuve</button>
      </div>
    </section>
  );
}

export function QuickActionMenu() {
  const actions = [
    ['Envoyer PDF', 'Actif'],
    ['Annuler facture', 'Désactivé: période contrôlée'],
    ['Créer avoir', 'Actif'],
    ['Archiver preuve', 'Actif'],
  ];
  return (
    <section className="uxQuickActions" aria-label="Menu actions rapides">
      {actions.map(([label, state]) => (
        <button key={label} className={state.startsWith('Désactivé') ? 'uxSecondaryButton' : ''} type="button" aria-disabled={state.startsWith('Désactivé')}>
          {label}<span>{state}</span>
        </button>
      ))}
    </section>
  );
}

export function PdfPreviewDrawer() {
  return (
    <aside className="uxPdfDrawer" aria-label="Aperçu PDF">
      <h2>Aperçu PDF bilingue</h2>
      <div className="uxDocumentPreview">FAC-2026-014 · FR principal · champs arabes prêts · checksum sha256:fac014</div>
      <div className="uxActionGrid">
        <button type="button">Zoom +</button>
        <button className="uxSecondaryButton" type="button">Télécharger</button>
        <button className="uxSecondaryButton" type="button">Envoyer</button>
        <button className="uxSecondaryButton" type="button">Archiver</button>
      </div>
    </aside>
  );
}

export function ShortcutCheatSheet({ shortcuts }: { shortcuts: Array<{ keys: string; labelFr: string; conflict: boolean }> }) {
  return (
    <section className="uxShortcutSheet" aria-label="Raccourcis clavier">
      {shortcuts.map((shortcut) => (
        <div key={shortcut.keys}>
          <kbd>{shortcut.keys}</kbd>
          <span>{shortcut.labelFr}</span>
          <UxStatusPill status={shortcut.conflict ? 'danger' : 'ok'}>{shortcut.conflict ? 'Conflit' : 'OK'}</UxStatusPill>
        </div>
      ))}
    </section>
  );
}

export function NotificationItem() {
  return (
    <article className="uxNotificationItem">
      <UxStatusPill status="warning">Échéance</UxStatusPill>
      <strong>TVA mai à préparer</strong>
      <span>Avant le 20/06/2026 · Comptabilité</span>
      <button type="button">Ouvrir</button>
      <button className="uxSecondaryButton" type="button">Snooze</button>
    </article>
  );
}

export function EnhancedKpiCard() {
  return (
    <article className="uxKpiCard uxEnhancedKpi" title="Drilldown vers les factures échues">
      <span>DSO cible</span>
      <strong>34 j</strong>
      <em className={statusClass('warning')}>+4 j vs cible · ouvrir détail</em>
    </article>
  );
}
