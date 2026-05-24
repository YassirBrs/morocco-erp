import { adminComplianceWorkspace, designSystemCatalog } from './erp-operations-fixtures';
import { DenseDataTable, KpiStrip, WorkspaceHeader, WorkspaceTabs } from './erp-workspace-patterns';

export function AdminComplianceWorkspacePage({ mode = 'admin' }: { mode?: 'admin' | 'conformite' }) {
  const isCompliance = mode === 'conformite';

  return (
    <main className="modulePage uxRoutePage">
      <WorkspaceHeader
        eyebrow={isCompliance ? 'Espace Conformité' : 'Espace Admin/Conformité'}
        title={isCompliance ? 'Règles Maroc, télédéclaration et archives' : 'Administration tenant et conformité'}
        subtitle="Paramètres tenant, utilisateurs, rôles, numérotation, rule packs Maroc, adaptateurs DGI/CNSS/banques, archive légale, audit et diagnostics."
        primaryAction={isCompliance ? 'Préparer télédéclaration' : 'Inviter utilisateur'}
        secondaryAction="Exporter audit"
      />
      <WorkspaceTabs tabs={['Tenant', 'Utilisateurs', 'Rôles', 'Numérotation', 'Rule packs', 'Adaptateurs', 'Archive', 'Audit', 'Diagnostics', 'Design system']} />
      <KpiStrip
        items={[
          { label: 'Complétude tenant', value: '84 %', trend: 'ICE/IF/RC prêts', status: 'ok' },
          { label: 'Rôles sensibles', value: '3', trend: 'MFA requis', status: 'warning' },
          { label: 'Adaptateurs live', value: '0', trend: 'Sandbox uniquement', status: 'info' },
          { label: 'Preuves archive', value: '24', trend: '1 correction', status: 'warning' },
        ]}
      />

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Utilisateurs, rôles et permissions"
          columns={[
            { label: 'Utilisateur', sortable: true },
            { label: 'Rôle', sortable: true },
            { label: 'Permission', sortable: true },
            { label: 'Séparation des tâches', sortable: true },
            { label: 'Accès', sortable: true },
          ]}
          rows={adminComplianceWorkspace.users.map((cells) => ({ cells, status: cells[3].includes('Conflit') ? 'warning' : 'ok' }))}
          emptyAction="Inviter utilisateur"
        />
        <DenseDataTable
          title="Paramètres de numérotation"
          columns={[
            { label: 'Document', sortable: true },
            { label: 'Série', sortable: true },
            { label: 'Prochain numéro', sortable: true },
            { label: 'Règle', sortable: true },
            { label: 'Audit', sortable: true },
          ]}
          rows={adminComplianceWorkspace.numbering.map((cells) => ({ cells, status: 'ok' }))}
          emptyAction="Ajouter série"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Rule packs conformité Maroc"
          columns={[
            { label: 'Pack', sortable: true },
            { label: 'Règle', sortable: true },
            { label: 'Date effet', sortable: true },
            { label: 'Modules impactés', sortable: true },
            { label: 'Statut', sortable: true },
          ]}
          rows={adminComplianceWorkspace.rules.map((cells) => ({ cells, status: 'ok' }))}
          emptyAction="Créer rule pack"
        />
        <DenseDataTable
          title="Centre adaptateurs"
          columns={[
            { label: 'Connecteur', sortable: true },
            { label: 'Mode', sortable: true },
            { label: 'Capacité', sortable: true },
            { label: 'Blocage', sortable: true },
            { label: 'Preuve', sortable: true },
          ]}
          rows={adminComplianceWorkspace.adapters.map((cells) => ({ cells, status: cells[3].includes('absents') || cells[3].includes('inactive') ? 'warning' : 'info' }))}
          emptyAction="Configurer adapter"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Archive légale et preuves"
          columns={[
            { label: 'Type', sortable: true },
            { label: 'Source', sortable: true },
            { label: 'Checksum', sortable: true },
            { label: 'Rétention', sortable: true },
            { label: 'Intégrité', sortable: true },
          ]}
          rows={adminComplianceWorkspace.archive.map((cells) => ({ cells, status: cells[4].includes('corriger') ? 'warning' : 'ok' }))}
          emptyAction="Exporter bundle"
        />
        <DenseDataTable
          title="Explorateur audit"
          columns={[
            { label: 'Date', sortable: true },
            { label: 'Utilisateur', sortable: true },
            { label: 'Module', sortable: true },
            { label: 'Action', sortable: true },
            { label: 'IP', sortable: true },
            { label: 'Entité', sortable: true },
          ]}
          rows={adminComplianceWorkspace.audit.map((cells) => ({ cells, status: 'info' }))}
          emptyAction="Exporter audit"
        />
      </div>

      <DenseDataTable
        title="Diagnostics support et feature gates"
        columns={[
          { label: 'Service', sortable: true },
          { label: 'État', sortable: true },
          { label: 'Mesure', sortable: true },
          { label: 'Action', sortable: true },
        ]}
        rows={adminComplianceWorkspace.diagnostics.map((cells) => ({ cells, status: cells[1] === 'OK' ? 'ok' : 'warning' }))}
        emptyAction="Créer incident"
      />

      <section className="uxPanel">
        <div className="uxPanelHeader">
          <div>
            <h2>Catalogue design system ERP</h2>
            <p>Tokens, composants, badges d’icônes, glossaire français et règles Arabic-ready.</p>
          </div>
          <button type="button">Voir règles UI</button>
        </div>
        <div className="uxDesignCatalog">
          <div>
            <h3>Tokens</h3>
            {designSystemCatalog.tokens.map(([name, value, usage]) => <span key={name}>{name}: {value} · {usage}</span>)}
          </div>
          <div>
            <h3>Composants</h3>
            {designSystemCatalog.components.map((component) => <span key={component}>{component}</span>)}
          </div>
          <div>
            <h3>Icônes badges</h3>
            {designSystemCatalog.iconBadges.map(([badge, label]) => <span key={badge}>{badge} · {label}</span>)}
          </div>
          <div>
            <h3>Glossaire FR</h3>
            {designSystemCatalog.glossary.map(([source, french]) => <span key={source}>{source} → {french}</span>)}
          </div>
          <div>
            <h3>Arabic-ready</h3>
            {designSystemCatalog.arabicReady.map(([field, rule]) => <span key={field}>{field}: {rule}</span>)}
          </div>
          <div>
            <h3>Parcours guidés</h3>
            {designSystemCatalog.journeys.map(([kind, journey]) => <span key={kind}>{kind}: {journey}</span>)}
          </div>
        </div>
      </section>

      <section className="uxPanel">
        <div className="uxPanelHeader">
          <div>
            <h2>Tiroir d’aide contextuelle</h2>
            <p>Explications courtes par espace, orientées opérations, sans texte marketing.</p>
          </div>
          <button className="uxSecondaryButton" type="button">Ouvrir l’aide</button>
        </div>
        <ul className="uxChecklist">
          <li>Ventes: convertir devis, surveiller crédit et préparer facture conforme.</li>
          <li>Achats/Stock: réceptionner, contrôler CUMP et traiter les écarts.</li>
          <li>Comptabilité: vérifier TVA, pièces, rapprochement et verrouillage période.</li>
          <li>Paie/RH: corriger CNSS, valider run et archiver Damancom.</li>
        </ul>
      </section>
    </main>
  );
}
