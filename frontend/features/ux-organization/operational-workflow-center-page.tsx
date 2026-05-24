import { workflowProductization } from './workflow-productization-fixtures';
import { DenseDataTable, KpiStrip, WorkspaceHeader, WorkspaceTabs, statusClass } from './erp-workspace-patterns';

export function OperationalWorkflowCenterPage() {
  return (
    <main className="modulePage uxRoutePage uxWorkflowCenter">
      <WorkspaceHeader
        eyebrow="Centre workflow produit"
        title="Import, export, documents, tâches et approbations"
        subtitle="Un espace transverse pour accélérer les opérations ERP marocaines: import CSV, exports légaux, PDF, emails, pièces jointes, timelines, tâches, approvals et parcours Odoo/Sage-grade."
        primaryAction="Lancer import CSV"
        secondaryAction="Ouvrir centre exports"
      />
      <WorkspaceTabs tabs={['Import', 'Exports', 'Documents', 'Emails', 'Pièces', 'Timeline', 'Tâches', 'Approbations', 'Productivité', 'Benchmark']} />
      <KpiStrip
        items={[
          { label: 'Imports en revue', value: '3', trend: '1 bloquant PCGE', status: 'warning' },
          { label: 'Exports terminés', value: '18', trend: 'Checksums archivés', status: 'ok' },
          { label: 'Approbations', value: '7', trend: '3 urgentes', status: 'danger' },
          { label: 'Score Odoo/Sage', value: '86/100', trend: 'Densité + conformité', status: 'info' },
        ]}
      />

      <section className="uxPanel">
        <div className="uxPanelHeader">
          <div>
            <h2>Assistant import CSV</h2>
            <p>Téléversement, mapping, prévisualisation, doublons, erreurs DTO en français et rapport d’import.</p>
          </div>
          <button type="button">Téléverser fichier</button>
        </div>
        <ol className="uxWizardSteps">
          {workflowProductization.importAssistant.steps.map((step, index) => (
            <li key={step} className={index === 2 ? 'current' : index < 2 ? 'done' : ''}>{step}</li>
          ))}
        </ol>
        <DenseDataTable
          title="Prévisualisation validation import"
          columns={[
            { label: 'Ligne', sortable: true },
            { label: 'Entité', sortable: true },
            { label: 'Erreur', sortable: true },
            { label: 'Sévérité', sortable: true },
            { label: 'Correction suggérée', sortable: true },
          ]}
          rows={workflowProductization.importAssistant.rows.map((cells) => ({ cells, status: cells[3] === 'Bloquant' ? 'danger' : cells[3] === 'Doublon' ? 'warning' : 'info' }))}
          emptyAction="Mapper les champs"
        />
      </section>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Centre exports"
          columns={[
            { label: 'Modèle', sortable: true },
            { label: 'Module', sortable: true },
            { label: 'Format', sortable: true },
            { label: 'Statut', sortable: true },
            { label: 'Checksum', sortable: true },
            { label: 'Rétention', sortable: true },
          ]}
          rows={workflowProductization.exportCenter.map((cells) => ({ cells, status: cells[3] === 'Terminé' ? 'ok' : cells[3] === 'Erreur' ? 'danger' : 'info' }))}
          emptyAction="Créer export"
        />
        <DenseDataTable
          title="Aperçus PDF"
          columns={[
            { label: 'Type', sortable: true },
            { label: 'Document', sortable: true },
            { label: 'Mentions', sortable: true },
            { label: 'Statut', sortable: true },
            { label: 'Langue', sortable: true },
          ]}
          rows={workflowProductization.pdfPreviews.map((cells) => ({ cells, status: cells[3].includes('prêt') ? 'ok' : 'info' }))}
          emptyAction="Prévisualiser PDF"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Workflow email et envoi"
          columns={[
            { label: 'Destinataire', sortable: true },
            { label: 'Document', sortable: true },
            { label: 'Modèle', sortable: true },
            { label: 'Pièces jointes', sortable: true },
            { label: 'Statut audit', sortable: true },
          ]}
          rows={workflowProductization.emailWorkflow.map((cells) => ({ cells, status: 'info' }))}
          emptyAction="Préparer email"
        />
        <section className="uxPanel">
          <div className="uxPanelHeader">
            <div>
              <h2>Pièces jointes et preuves</h2>
              <p>Drag-drop, type fichier, classification, checksum et étiquette de rétention.</p>
            </div>
            <button type="button">Ajouter preuve</button>
          </div>
          <div className="uxDropzone" role="button" tabIndex={0} aria-label="Déposer des fichiers de preuve">
            Déposer PDF, image ou CSV ici · classification obligatoire avant archivage.
          </div>
          <DenseDataTable
            title="Fichiers classés"
            columns={[
              { label: 'Fichier', sortable: true },
              { label: 'Type', sortable: true },
              { label: 'Catégorie', sortable: true },
              { label: 'Checksum', sortable: true },
              { label: 'Rétention', sortable: true },
              { label: 'Lien', sortable: true },
            ]}
            rows={workflowProductization.attachments.map((cells) => ({ cells, status: 'ok' }))}
            emptyAction="Classer fichier"
          />
        </section>
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Timeline activité"
          columns={[
            { label: 'Date', sortable: true },
            { label: 'Acteur', sortable: true },
            { label: 'Type', sortable: true },
            { label: 'Événement', sortable: true },
            { label: 'Entité', sortable: true },
          ]}
          rows={workflowProductization.timeline.map((cells) => ({ cells, status: 'info' }))}
          emptyAction="Ajouter note"
        />
        <DenseDataTable
          title="Tiroir tâches"
          columns={[
            { label: 'Tâche', sortable: true },
            { label: 'Assigné à', sortable: true },
            { label: 'Échéance', sortable: true },
            { label: 'Priorité', sortable: true },
            { label: 'Entité liée', sortable: true },
            { label: 'Statut', sortable: true },
          ]}
          rows={workflowProductization.taskDrawer.map((cells) => ({ cells, status: cells[3] === 'Haute' ? 'warning' : 'info' }))}
          emptyAction="Créer tâche"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Boîte d’approbation"
          columns={[
            { label: 'Demande', sortable: true },
            { label: 'Référence', sortable: true },
            { label: 'Impact financier', sortable: true },
            { label: 'Règle', sortable: true },
            { label: 'Reviewer', sortable: true },
            { label: 'Décision', sortable: true },
          ]}
          rows={workflowProductization.approvals.map((cells) => ({ cells, status: cells[5].includes('Bloqué') ? 'danger' : 'warning' }))}
          emptyAction="Configurer approbation"
        />
        <section className="uxPanel">
          <div className="uxPanelHeader">
            <div>
              <h2>Détail approbation manager</h2>
              <p>Changement demandé, impact financier, règle politique, commentaires, approuver, rejeter et audit.</p>
            </div>
            <div className="uxHeaderActions">
              <button type="button">Approuver</button>
              <button className="uxSecondaryButton" type="button">Rejeter</button>
            </div>
          </div>
          <div className="uxApprovalDetail">
            <div><span>Demande</span><strong>DV-2026-022 · remise commerciale</strong></div>
            <div><span>Impact</span><strong className={statusClass('warning')}>Marge -4 200 MAD</strong></div>
            <div><span>Règle</span><strong>Remise supérieure à 10 %</strong></div>
            <label>
              <span>Commentaire décision</span>
              <textarea defaultValue="Validation conditionnée à paiement acompte 40 %." />
            </label>
          </div>
        </section>
      </div>

      <DenseDataTable
        title="Liens records transverses"
        columns={[
          { label: 'Document', sortable: true },
          { label: 'Tiers', sortable: true },
          { label: 'Document lié', sortable: true },
          { label: 'Journal', sortable: true },
          { label: 'Paiement/achat', sortable: true },
          { label: 'Preuve', sortable: true },
        ]}
        rows={workflowProductization.relatedRecords.map((cells) => ({ cells, status: 'info' }))}
        emptyAction="Créer lien"
      />

      <div className="uxWorkflowCards">
        {workflowProductization.uxStates.map(([title, detail, rule]) => (
          <article key={title}>
            <strong>{title}</strong>
            <span>{detail}</span>
            <em>{rule}</em>
          </article>
        ))}
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Widgets personnalisables"
          columns={[
            { label: 'Rôle', sortable: true },
            { label: 'Widgets', sortable: true },
            { label: 'Organisation', sortable: true },
            { label: 'Action', sortable: true },
          ]}
          rows={workflowProductization.configurableWidgets.map((cells) => ({ cells, status: 'ok' }))}
          emptyAction="Personnaliser tableau"
        />
        <DenseDataTable
          title="Kanban opérationnels"
          columns={[
            { label: 'Board', sortable: true },
            { label: 'Étapes', sortable: true },
            { label: 'Règle audit', sortable: true },
          ]}
          rows={workflowProductization.kanbanBoards.map((cells) => ({ cells, status: 'info' }))}
          emptyAction="Créer Kanban"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Calendriers métier"
          columns={[
            { label: 'Calendrier', sortable: true },
            { label: 'Données', sortable: true },
            { label: 'Signal', sortable: true },
          ]}
          rows={workflowProductization.calendars.map((cells) => ({ cells, status: 'info' }))}
          emptyAction="Ouvrir calendrier"
        />
        <DenseDataTable
          title="Grilles éditables"
          columns={[
            { label: 'Grille', sortable: true },
            { label: 'Colonnes', sortable: true },
            { label: 'Contrôle', sortable: true },
          ]}
          rows={workflowProductization.editableGrids.map((cells) => ({ cells, status: 'ok' }))}
          emptyAction="Ouvrir grille"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Suggestions IA auditables"
          columns={[
            { label: 'Suggestion', sortable: true },
            { label: 'Raison', sortable: true },
            { label: 'Garde-fou', sortable: true },
          ]}
          rows={workflowProductization.aiSuggestions.map((cells) => ({ cells, status: 'info' }))}
          emptyAction="Analyser actions"
        />
        <DenseDataTable
          title="Scorecard Odoo/Sage"
          columns={[
            { label: 'Critère', sortable: true },
            { label: 'Preuve UX', sortable: true },
            { label: 'Position', sortable: true },
          ]}
          rows={workflowProductization.competitorScorecard.map((cells) => ({ cells, status: 'ok' }))}
          emptyAction="Recalculer score"
        />
      </div>

      <div className="uxWorkspaceGrid">
        <DenseDataTable
          title="Cartes de parcours utilisateurs"
          columns={[
            { label: 'Segment', sortable: true },
            { label: 'Parcours', sortable: true },
          ]}
          rows={workflowProductization.journeyMaps.map((cells) => ({ cells, status: 'info' }))}
          emptyAction="Créer parcours"
        />
        <DenseDataTable
          title="Architecture informationnelle"
          columns={[
            { label: 'Espace', sortable: true },
            { label: 'Menus et sous-menus', sortable: true },
            { label: 'Objectif utilisateur', sortable: true },
          ]}
          rows={workflowProductization.informationArchitecture.map((cells) => ({ cells, status: 'ok' }))}
          emptyAction="Documenter espace"
        />
      </div>
    </main>
  );
}
