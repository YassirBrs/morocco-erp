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
