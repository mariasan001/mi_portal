'use client';

import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';

import { useRecibosController } from '../application/useRecibosController';
import { useRecibosExplorer } from '../application/useRecibosExplorer';
import NominaRecibosExplorerToolbar from './components/NominaRecibosExplorerToolbar';
import NominaRecibosVersionAccordion from './components/NominaRecibosVersionAccordion';
import s from './RecibosPage.module.css';

export default function RecibosPage() {
  const vm = useRecibosController();
  const explorer = useRecibosExplorer(vm.versionCards);

  const toolbar = (
    <NominaRecibosExplorerToolbar
      query={explorer.query}
      stageOptions={explorer.stageOptions}
      stageValue={explorer.stageFilter}
      statusOptions={explorer.statusOptions}
      statusValue={explorer.statusFilter}
      sortValue={explorer.sort}
      onQueryChange={explorer.setQuery}
      onStageChange={explorer.setStageFilter}
      onStatusChange={explorer.setStatusFilter}
      onSortChange={explorer.setSort}
    />
  );

  return (
    <AdminPageShell>
      <NominaHero
        title="Liberacion de nomina"
        subtitle={
          <>
            <strong>Selecciona una version para continuar su flujo previo.</strong>{' '}
            Despues podras ejecutar <em>snapshots, recibos, sincronizacion y liberacion</em> desde una sola vista.
          </>
        }
      />

      {vm.currentError ? (
        <AdminInlineMessage title="Ocurrio un problema" tone="error">
          {vm.currentError}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface as="section" className={s.contentShell}>
        {vm.versionCards.length ? (
          <div className={s.toolbarArea}>
            {toolbar}
            <span className={s.metaText}>{explorer.metaText}</span>
          </div>
        ) : null}

        {vm.versionCards.length ? (
          explorer.filteredItems.length ? (
            <NominaRecibosVersionAccordion
              items={explorer.filteredItems}
              selectedVersionId={vm.selectedVersionId}
              activeAction={vm.activeAction}
              loading={vm.currentLoading}
              technicalFlowLoading={vm.technicalFlowLoading}
              technicalFlowVersionId={vm.technicalFlowVersionId}
              form={vm.form}
              results={vm.results}
              onSelectVersion={vm.setSelectedVersionId}
              onSelectAction={vm.setActiveAction}
              onUpdateField={vm.updateField}
              onExecuteStep={vm.executeStep}
              onExecuteTechnicalFlow={vm.executeTechnicalFlow}
            />
          ) : (
            <div className={s.emptyArea}>
              <NominaEmptyState
                title="Sin coincidencias"
                description="Prueba con otra busqueda, ajusta el estatus o cambia el orden para volver a ver versiones."
                variant="inbox"
                tone="compact"
              />
            </div>
          )
        ) : (
          <div className={s.emptyArea}>
            <NominaEmptyState
              title={
                vm.loadingVersions
                  ? 'Cargando versiones de nomina'
                  : 'Aun no hay versiones para trabajar'
              }
              description="Cuando la API de versiones responda, aqui podras abrir cada version y continuar su flujo tecnico."
              variant="inbox"
              tone="compact"
            />
          </div>
        )}
      </AdminSurface>
    </AdminPageShell>
  );
}
