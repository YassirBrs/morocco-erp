import {
  commandResults,
  notificationItems,
  rolePresets,
  setupItems,
  workspaces,
} from './erp-workspace-fixtures';
import {
  AccessibilityChecklist,
  DenseDataTable,
  FeedbackStates,
  FormValidationCard,
  KpiStrip,
  NextStepActions,
  PreviewSidePanels,
  QuickCreateModals,
  RecordDetailStandard,
  StatusPipeline,
  WorkspaceTabs,
  statusClass,
} from './erp-workspace-patterns';
import { statusPipelines } from './erp-workspace-fixtures';

export function ErpShellWorkspace() {
  const activeWorkspace = workspaces[0];

  return (
    <section className="uxShellShowcase" aria-label="Nouvelle organisation ERP Odoo Sage">
      <header className="uxWorkspaceHeader">
        <div>
          <p className="eyebrow">Organisation cible</p>
          <h2>ERP Maroc organisé par espaces de travail</h2>
          <p>
            Navigation dense et opérationnelle: Ventes, Achats/Stock, Comptabilité, Paie/RH et Admin/Conformité,
            avec rôles, alertes, favoris, raccourcis et documents récents.
          </p>
        </div>
        <div className="uxHeaderActions">
          <button className="uxSecondaryButton" type="button" aria-label="Ouvrir la visite guidée">Visite guidée</button>
          <button type="button" aria-label="Créer un nouveau document">Nouveau document</button>
        </div>
      </header>

      <div className="uxDesktopFrame">
        <aside className="uxLauncher" aria-label="Lanceur d'applications ERP">
          <div className="uxLauncherBrand">
            <span>ME</span>
            <div>
              <strong>Morocco ERP</strong>
              <small>Plan Entreprise · tenant demo</small>
            </div>
          </div>
          <nav aria-label="Espaces principaux">
            {workspaces.map((workspace) => (
              <a key={workspace.id} href={workspace.href} className={workspace.id === activeWorkspace.id ? 'active' : ''}>
                <span aria-hidden="true">{workspace.icon}</span>
                <strong>{workspace.title}</strong>
                <small>{workspace.pinned ? 'Épinglé' : workspace.healthLabel}</small>
              </a>
            ))}
          </nav>
          <div className="uxMobileFallback" role="status">
            Navigation mobile: bouton menu, recherche, onglets, cible tactile 44 px, aucun défilement horizontal.
          </div>
        </aside>

        <main className="uxDesktopWorkspace">
          <div className="uxTopbar">
            <div className="uxBreadcrumbs" aria-label="Fil d'Ariane">
              <a href="/">Accueil</a>
              <span>/</span>
              <a href={activeWorkspace.href}>{activeWorkspace.title}</a>
              <span>/</span>
              <strong>Vue d'ensemble</strong>
            </div>
            <div className="uxTenantSwitch" aria-label="Sélecteur tenant">
              <strong>Atlas Bureau SARL</strong>
              <span className={statusClass('ok')}>Santé client 84 %</span>
            </div>
          </div>

          <section className="uxCommandPalette" aria-label="Palette de commandes universelle">
            <label htmlFor="ux-command">Commande universelle</label>
            <input id="ux-command" defaultValue="facture atlas" aria-describedby="ux-command-help" />
            <small id="ux-command-help">Créer, rechercher, changer d'espace, ouvrir les documents récents et lancer les exports.</small>
            <div className="uxCommandResults">
              {commandResults.map((item) => (
                <a key={item.label} href={item.target}>
                  <span>{item.type}</span>
                  <strong>{item.label}</strong>
                  <kbd>{item.shortcut}</kbd>
                </a>
              ))}
            </div>
          </section>

          <WorkspaceTabs tabs={activeWorkspace.tabs} />
          <KpiStrip items={activeWorkspace.kpis} />

          <div className="uxWorkspaceGrid">
            <section className="uxPanel">
              <div className="uxPanelHeader">
                <div>
                  <h2>Décision du tableau de bord</h2>
                  <p>Le premier écran oriente vers le prochain travail urgent par rôle.</p>
                </div>
                <button type="button">Voir mes urgences</button>
              </div>
              <div className="uxDecisionTree">
                {workspaces.map((workspace) => (
                  <a key={workspace.id} href={workspace.href}>
                    <span aria-hidden="true">{workspace.icon}</span>
                    <strong>{workspace.title}</strong>
                    <small>{workspace.healthLabel}</small>
                  </a>
                ))}
              </div>
            </section>

            <section className="uxPanel">
              <div className="uxPanelHeader">
                <div>
                  <h2>Centre notifications</h2>
                  <p>Approbations, impayés, stock, paie, dates fiscales et imports.</p>
                </div>
                <button className="uxSecondaryButton" type="button">Tout filtrer</button>
              </div>
              <div className="uxNotificationList">
                {notificationItems.map((item) => (
                  <article key={item.detail}>
                    <span className={statusClass(item.severity)}>{item.label}</span>
                    <strong>{item.detail}</strong>
                    <button className="uxSecondaryButton" type="button">{item.action}</button>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <DenseDataTable
            title="Documents récents"
            columns={[
              { label: 'Numéro', sortable: true },
              { label: 'Tiers', sortable: true },
              { label: 'Montant', sortable: true, numeric: true },
              { label: 'Responsable', sortable: true },
              { label: 'Statut', sortable: true },
            ]}
            rows={activeWorkspace.recentDocuments.map((document) => ({
              cells: [document.number, document.party, document.amount, document.owner, document.status],
              status: document.status.includes('Échue') || document.status.includes('requise') ? 'warning' : 'info',
            }))}
          />

          <div className="uxWorkspaceGrid">
            <StatusPipeline title="Pipeline documents commerciaux" steps={statusPipelines.sales} />
            <NextStepActions actions={['Approuver devis', 'Convertir en commande', 'Préparer BL', 'Émettre facture', 'Encaisser paiement', 'Envoyer PDF']} />
          </div>

          <div className="uxWorkspaceGrid">
            <RecordDetailStandard title="DV-2026-022" status="Approbation requise" meta="Atlas Bureautique SARL · ICE 001525874000033 · série DV-2026">
              <DenseDataTable
                title="Lignes du document"
                columns={[
                  { label: 'Article', sortable: true },
                  { label: 'Quantité', numeric: true },
                  { label: 'Prix HT', numeric: true },
                  { label: 'TVA', sortable: true },
                  { label: 'Total TTC', numeric: true },
                ]}
                rows={[
                  { cells: ['SKU-CHAIR', '12', '1 250 MAD', '20 %', '18 000 MAD'], status: 'ok' },
                  { cells: ['SERV-LIV', '1', '600 MAD', '20 %', '720 MAD'], status: 'ok' },
                ]}
              />
            </RecordDetailStandard>
            <FormValidationCard />
          </div>

          <div className="uxWorkspaceGrid">
            <PreviewSidePanels />
            <QuickCreateModals />
          </div>

          <div className="uxWorkspaceGrid">
            <FeedbackStates />
            <AccessibilityChecklist />
          </div>

          <section className="uxPanel">
            <div className="uxPanelHeader">
              <div>
                <h2>Presets de navigation par rôle</h2>
                <p>Chaque utilisateur ne voit que les espaces et actions utiles à son travail.</p>
              </div>
              <button className="uxSecondaryButton" type="button">Simuler un rôle</button>
            </div>
            <div className="uxRoleGrid">
              {rolePresets.map((preset) => (
                <article key={preset.role}>
                  <strong>{preset.role}</strong>
                  <span>{preset.workspaces.join(' · ')}</span>
                  <p>{preset.focus}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="uxPanel">
            <div className="uxPanelHeader">
              <div>
                <h2>Centre de progression configuration Maroc</h2>
                <p>ICE, IF, RC, Patente, CNSS, TVA, période fiscale, numérotation et banques pointent vers les bons écrans.</p>
              </div>
              <button type="button">Compléter setup</button>
            </div>
            <div className="uxSetupGrid">
              {setupItems.map((item) => (
                <a key={item.label} href={item.href}>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                  <em className={statusClass(item.status)}>{item.status === 'ok' ? 'Complet' : item.status === 'warning' ? 'À corriger' : 'À vérifier'}</em>
                </a>
              ))}
            </div>
          </section>

          <section className="uxPanel">
            <div className="uxPanelHeader">
              <div>
                <h2>Vues sauvegardées et raccourcis</h2>
                <p>Filtres privés/partagés, colonnes visibles et raccourcis clavier cohérents.</p>
              </div>
              <button className="uxSecondaryButton" type="button">Gérer mes vues</button>
            </div>
            <div className="uxSavedViewGrid">
              {workspaces.flatMap((workspace) => workspace.savedFilters.map((filter) => ({ workspace: workspace.title, filter }))).slice(0, 10).map((item) => (
                <article key={`${item.workspace}-${item.filter}`}>
                  <strong>{item.filter}</strong>
                  <span>{item.workspace} · partagé selon rôle</span>
                </article>
              ))}
              {[
                ['Ctrl+K', 'Palette commandes'],
                ['Ctrl+S', 'Enregistrer formulaire'],
                ['N', 'Nouveau document'],
                ['G puis V', 'Aller aux ventes'],
                ['G puis S', 'Aller Achats/Stock'],
              ].map(([shortcut, detail]) => (
                <article key={shortcut}>
                  <kbd>{shortcut}</kbd>
                  <span>{detail}</span>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
