import { getUxQualityMigrationReadiness, uxQualityMigrationRoutes } from '../../lib/api';
import { DenseDataTable, KpiStrip, WorkspaceHeader, WorkspaceTabs } from './erp-workspace-patterns';
import { qualityMigrationShowcase } from './quality-migration-fixtures';

const tableRows = (rows: string[][]) => rows.map((cells) => ({ cells, status: cells[cells.length - 1]?.includes('Couvert') || cells[cells.length - 1]?.includes('prêt') || cells[cells.length - 1]?.includes('PASS') ? 'ok' as const : 'info' as const }));

export async function QualityMigrationWorkspacePage() {
  const readiness = await getUxQualityMigrationReadiness();

  return (
    <main className="modulePage uxRoutePage uxQualityMigration">
      <WorkspaceHeader
        eyebrow="Qualité, migration et adoption"
        title="Gates Playwright, migration Sage/Odoo, portails et modes mobiles"
        subtitle="Un centre d’exécution pour rendre Morocco ERP plus facile à adopter qu’Odoo ou Sage 100: tests, migration, aide, setup, portails, recherche, qualité data, feedback et release gate."
        primaryAction="Lancer release gate"
        secondaryAction="Importer Sage/Odoo"
      />
      <WorkspaceTabs tabs={['Tests', 'Migration', 'Setup', 'Portails', 'Mobile', 'Qualité data', 'Release']} />
      <KpiStrip items={qualityMigrationShowcase.kpis} />

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="POS et Admin smoke tests"
          columns={[
            { label: 'Workspace', sortable: true },
            { label: 'Parcours', sortable: true },
            { label: 'Statut', sortable: true },
          ]}
          rows={tableRows(qualityMigrationShowcase.posAdminSmoke)}
        />
        <DenseDataTable
          title="Playwright quality matrix"
          columns={[
            { label: 'Suite', sortable: true },
            { label: 'Portée', sortable: true },
            { label: 'Contrôle', sortable: true },
          ]}
          rows={tableRows(qualityMigrationShowcase.playwrightRows)}
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Frontend unit test contracts"
          columns={[
            { label: 'Zone', sortable: true },
            { label: 'Couverture', sortable: true },
            { label: 'Statut', sortable: true },
          ]}
          rows={tableRows(qualityMigrationShowcase.frontendUnitRows)}
        />
        <section className="uxPanel">
          <div className="uxPanelHeader">
            <div>
              <h2>Guided implementation checklist Odoo/Sage</h2>
              <p>Critères readiness: légal, PCGE, soldes, ventes, CUMP, paie Damancom, exports cabinet.</p>
            </div>
            <button type="button">Voir critères</button>
          </div>
          <div className="uxQualityScore">
            <strong>{readiness.implementationChecklist?.odooSageReplacementScore ?? 88}/100</strong>
            <span>Score de remplacement Odoo/Sage pour pilote PME marocaine.</span>
          </div>
        </section>
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Data migration wizard Sage 100 et Odoo"
          columns={[
            { label: 'Source', sortable: true },
            { label: 'Données', sortable: true },
            { label: 'Résultat', sortable: true },
          ]}
          rows={tableRows(qualityMigrationShowcase.migrationRows)}
        />
        <section className="uxPanel">
          <div className="uxPanelHeader">
            <div>
              <h2>Competitor-style module app grid</h2>
              <p>Favoris, recherche, catégories, récemment utilisés et visibilité contrôlée par admin.</p>
            </div>
            <button type="button">Gérer favoris</button>
          </div>
          <div className="uxAppGrid">
            {['Ventes', 'Comptabilité', 'Achats/Stock', 'Paie/RH', 'POS', 'Admin'].map((item) => (
              <article key={item}>
                <strong>{item}</strong>
                <span>Favori · Catégorie · Récent</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Natural-language help search"
          columns={[
            { label: 'Source', sortable: true },
            { label: 'Exemples', sortable: true },
            { label: 'Contexte', sortable: true },
          ]}
          rows={tableRows([
            ['Documentation locale', 'Comment déclarer TVA?', 'Conformité Maroc'],
            ['Aide module', 'Créer un avoir', 'Ventes'],
            ['Glossaire', 'CUMP, ICE, IF, Damancom', 'Formation'],
            ['Notes conformité Maroc', 'TVA 20 %, CNSS, AMO, IR', 'Règles versionnées'],
          ])}
        />
        <DenseDataTable
          title="Guided setup wizards"
          columns={[
            { label: 'Assistant', sortable: true },
            { label: 'Étapes', sortable: true },
            { label: 'Statut', sortable: true },
          ]}
          rows={tableRows(qualityMigrationShowcase.setupRows)}
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Portal UX polish"
          columns={[
            { label: 'Portail', sortable: true },
            { label: 'Fonctions', sortable: true },
            { label: 'Statut', sortable: true },
          ]}
          rows={tableRows(qualityMigrationShowcase.portalRows)}
        />
        <DenseDataTable
          title="Mobile and dense workspace modes"
          columns={[
            { label: 'Mode', sortable: true },
            { label: 'Fonctions', sortable: true },
            { label: 'Canal', sortable: true },
          ]}
          rows={tableRows(qualityMigrationShowcase.mobileRows)}
        />
      </div>

      <DenseDataTable
        title="Search, duplicate, data quality, feedback, and release gate"
        columns={[
          { label: 'Contrôle', sortable: true },
          { label: 'Portée', sortable: true },
          { label: 'Sortie', sortable: true },
        ]}
        rows={tableRows(qualityMigrationShowcase.controlRows)}
      />

      <section className="uxPanel">
        <div className="uxPanelHeader compact">
          <h2>Quality migration API contract</h2>
        </div>
        <div className="uxRouteList">
          {uxQualityMigrationRoutes.map((route) => <code key={route}>{route}</code>)}
        </div>
      </section>
    </main>
  );
}

