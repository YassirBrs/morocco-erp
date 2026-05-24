import { getUxWorkspaceContractHub, uxWorkspaceContractRoutes } from '../../lib/api';
import { uxContractShowcase } from './erp-contract-fixtures';
import {
  ApprovalBanner,
  AuditDrawer,
  DenseDataTable,
  DocumentEvidencePanel,
  EnhancedKpiCard,
  FinancialTotalsPanel,
  LegalIdentityPanel,
  MoroccanValidationPanel,
  NotificationItem,
  PdfPreviewDrawer,
  QuickActionMenu,
  ReusableFormPage,
  ReusableListPage,
  ReusableRecordPage,
  ReusableWorkspaceHeader,
  ShortcutCheatSheet,
  TimelineComposer,
  UxStatusPill,
  WorkspaceTabs,
} from './erp-workspace-patterns';
import { keyboardShortcutRegistry, workspaceRouteStructure, workspaceUiStateStore } from './workspace-ui-state-store';

export async function ErpContractWorkspacePage() {
  const hub = await getUxWorkspaceContractHub();
  const listColumns = [
    { label: 'Numéro', sortable: true },
    { label: 'Tiers', sortable: true },
    { label: 'Statut', sortable: true },
    { label: 'Total TTC', sortable: true, numeric: true },
    { label: 'Signal', sortable: true },
  ];

  return (
    <main className="modulePage uxRoutePage uxContractWorkspace">
      <ReusableWorkspaceHeader
        title="Contrats API et composants workspace"
        subtitle="Contrats list-view, detail-view, form-schema, action-result, erreurs de validation, vues sauvegardées, jobs documents, permissions et smoke flows pour une ergonomie proche Odoo/Sage."
        kpis={uxContractShowcase.kpis}
        primaryAction="Valider contrats"
        secondaryAction="Ouvrir matrice permissions"
      />
      <WorkspaceTabs tabs={['Contrats API', 'Composants', 'Documents', 'Permissions', 'Smoke tests']} />

      <section className="uxPanel">
        <div className="uxPanelHeader">
          <div>
            <h2>UI state store tenant/role/workspace</h2>
            <p>État centralisé: tenant courant, rôle, workspace, modules épinglés, notifications et enregistrements récents.</p>
          </div>
          <button type="button">Synchroniser état</button>
        </div>
        <div className="uxStateStoreGrid">
          <article>
            <span>Tenant</span>
            <strong>{workspaceUiStateStore.currentTenant.tradeName}</strong>
            <small>{workspaceUiStateStore.currentTenant.currency} · langue principale FR · Arabic-ready</small>
          </article>
          <article>
            <span>Workspace</span>
            <strong>{workspaceUiStateStore.workspace.breadcrumbs.join(' / ')}</strong>
            <small>{hub.uiState.workspace.labelFr}</small>
          </article>
          <article>
            <span>Notifications</span>
            <strong>{workspaceUiStateStore.notifications.total}</strong>
            <small>Centre notifications groupé par sévérité</small>
          </article>
          <article>
            <span>Récents</span>
            <strong>{workspaceUiStateStore.recentRecords.join(', ')}</strong>
            <small>Factures, achats, paie, TVA</small>
          </article>
        </div>
      </section>

      <section className="uxPanel">
        <div className="uxPanelHeader">
          <div>
            <h2>Workspace route structure descriptive</h2>
            <p>Routes métiers pour sales, purchases, inventory, accounting, payroll, pos et admin, avec libellés français et alias contrôlés.</p>
          </div>
          <button type="button">Tester navigation</button>
        </div>
        <div className="uxRouteMatrix">
          {workspaceRouteStructure.map((route) => (
            <article key={route.key}>
              <strong>{route.labelFr}</strong>
              <span>{route.primaryPath}</span>
              <small>{route.aliases.join(' · ')}</small>
            </article>
          ))}
        </div>
      </section>

      <div className="uxWorkspaceGrid">
        <ReusableListPage
          title="Contrat list-view"
          columns={listColumns}
          rows={uxContractShowcase.listRows.map((cells) => ({ cells, status: cells[2].includes('requise') ? 'warning' : cells[2].includes('Réception') ? 'info' : 'ok' }))}
        />
        <ReusableRecordPage title={hub.detailView.header.title} status={hub.detailView.header.status}>
          <p className="eyebrow">Contrat detail-view</p>
          <ApprovalBanner />
          <FinancialTotalsPanel />
        </ReusableRecordPage>
      </div>

      <div className="uxWorkspaceGrid">
        <p className="eyebrow">Form page dynamique</p>
        <ReusableFormPage fields={uxContractShowcase.formFields} />
        <section className="uxPanel">
          <div className="uxPanelHeader compact">
            <h2>Validation-error contract</h2>
          </div>
          <DenseDataTable
            title="Erreurs DTO françaises"
            columns={[
              { label: 'Field path', sortable: true },
              { label: 'Sévérité', sortable: true },
              { label: 'Message', sortable: true },
              { label: 'Correction suggérée', sortable: true },
            ]}
            rows={uxContractShowcase.validationRows.map((cells) => ({ cells, status: cells[1] === 'Bloquant' ? 'danger' : 'warning' }))}
          />
        </section>
      </div>

      <div className="uxWorkspaceGrid">
        <section className="uxPanel">
          <div className="uxPanelHeader compact">
            <h2>Composants légaux et finance</h2>
          </div>
          <LegalIdentityPanel />
          <FinancialTotalsPanel />
          <MoroccanValidationPanel />
          <DocumentEvidencePanel />
        </section>
        <section className="uxPanel">
          <div className="uxPanelHeader compact">
            <h2>Timeline, audit, actions et notifications</h2>
          </div>
          <TimelineComposer />
          <QuickActionMenu />
          <NotificationItem />
          <EnhancedKpiCard />
          <AuditDrawer />
        </section>
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Export job status API"
          columns={[
            { label: 'Job', sortable: true },
            { label: 'Statut', sortable: true },
            { label: 'Fichier', sortable: true },
            { label: 'Checksum', sortable: true },
            { label: 'Rétention', sortable: true },
          ]}
          rows={uxContractShowcase.exportRows.map((cells) => ({ cells, status: cells[1] === 'Échec' ? 'danger' : cells[1] === 'En cours' ? 'info' : 'ok' }))}
        />
        <DenseDataTable
          title="Import preview table"
          columns={[
            { label: 'Job', sortable: true },
            { label: 'Statut', sortable: true },
            { label: 'Mapping', sortable: true },
            { label: 'Créés / erreurs', sortable: true },
            { label: 'Doublons', sortable: true },
          ]}
          rows={uxContractShowcase.importRows.map((cells) => ({ cells, status: cells[1] === 'Terminé' ? 'ok' : 'warning' }))}
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Document send-status API"
          columns={[
            { label: 'Document', sortable: true },
            { label: 'Canal', sortable: true },
            { label: 'Statut', sortable: true },
            { label: 'Destinataire', sortable: true },
            { label: 'Audit', sortable: true },
          ]}
          rows={uxContractShowcase.sendRows.map((cells) => ({ cells, status: cells[2] === 'En attente' ? 'warning' : 'ok' }))}
        />
        <section className="uxPanel">
          <div className="uxPanelHeader compact">
            <h2>PDF render-status API</h2>
          </div>
          <PdfPreviewDrawer />
          <DenseDataTable
            title="PDF legal mention coverage"
            columns={[
              { label: 'Document', sortable: true },
              { label: 'Template', sortable: true },
              { label: 'Langue', sortable: true },
              { label: 'Checksum', sortable: true },
              { label: 'Mentions', sortable: true },
            ]}
            rows={uxContractShowcase.pdfRows.map((cells) => ({ cells, status: 'ok' }))}
          />
        </section>
      </div>

      <div className="uxWorkspaceGrid">
        <section className="uxPanel">
          <div className="uxPanelHeader compact">
            <h2>Permission matrix API</h2>
          </div>
          <div className="uxPermissionGrid">
            {hub.permissionMatrix.routes.slice(0, 8).map((route) => (
              <article key={`${route.route}-${route.module}`}>
                <strong>{route.module}</strong>
                <span>{route.canRead ? 'Lecture autorisée' : 'Lecture masquée'}</span>
                <UxStatusPill status={route.canWrite ? 'ok' : 'warning'}>{route.canWrite ? 'Écriture OK' : route.disabledReasonFr ?? 'Écriture bloquée'}</UxStatusPill>
              </article>
            ))}
          </div>
          <ShortcutCheatSheet shortcuts={keyboardShortcutRegistry} />
        </section>
        <DenseDataTable
          title="Smoke tests workspace"
          columns={[
            { label: 'Workspace', sortable: true },
            { label: 'Parcours', sortable: true },
            { label: 'Statut', sortable: true },
          ]}
          rows={uxContractShowcase.smokeFlows.map((cells) => ({ cells, status: 'ok' }))}
        />
      </div>

      <section className="uxPanel">
        <div className="uxPanelHeader">
          <div>
            <h2>Action-result, saved filters et saved columns</h2>
            <p>Résultat d’action avec prochaine action, auditReference, enregistrements impactés, filtres persistés, colonnes visibles, ordre, largeurs et densité par rôle.</p>
          </div>
          <button type="button">Créer vue sauvegardée</button>
        </div>
        <div className="uxContractCards">
          <article>
            <span>Action-result API</span>
            <strong>{hub.actionResult.messageFr}</strong>
            <small>{hub.actionResult.nextSuggestedAction} · {hub.actionResult.auditReference}</small>
          </article>
          <article>
            <span>Saved-filter persistence</span>
            <strong>owner, shared roles, query definition, default state</strong>
            <small>Factures échues · Stock sous seuil · Mes factures bloquées</small>
          </article>
          <article>
            <span>Saved-column persistence</span>
            <strong>visible columns, order, widths, density, role defaults</strong>
            <small>OWNER compact · ACCOUNTANT dense</small>
          </article>
          <article>
            <span>Approval-policy API</span>
            <strong>{hub.approvalPolicy.requiredRole} · seuil {hub.approvalPolicy.threshold} MAD</strong>
            <small>{hub.approvalPolicy.reasonFr} · SLA {hub.approvalPolicy.slaHours} h</small>
          </article>
        </div>
      </section>

      <section className="uxPanel">
        <div className="uxPanelHeader compact">
          <h2>Routes backend contractuelles vérifiées</h2>
        </div>
        <div className="uxRouteList">
          {uxWorkspaceContractRoutes.map((route) => <code key={route}>{route}</code>)}
        </div>
      </section>
    </main>
  );
}
