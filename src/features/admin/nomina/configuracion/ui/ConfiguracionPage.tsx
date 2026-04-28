'use client';

import { X } from 'lucide-react';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';

import { useConfiguracionController } from '../application/useConfiguracionController';
import { usePeriodosExplorer } from '../application/usePeriodosExplorer';
import { useVersionesExplorer } from '../application/useVersionesExplorer';
import { getContentEyebrow, getContentTitle } from '../model/configuracion.selectors';
import NominaEntityCards from './components/NominaEntityCards';
import NominaExplorerToolbar from './components/NominaExplorerToolbar';
import PeriodosTable from './components/PeriodosTable';
import PeriodoCreateForm from './components/PeriodoCreateForm';
import VersionesTable from './components/VersionesTable';
import VersionCreateForm from './components/VersionCreateForm';
import s from './ConfiguracionPage.module.css';

export default function ConfiguracionPage() {
  const vm = useConfiguracionController();
  const periodosExplorer = usePeriodosExplorer(vm.periodos.lista);
  const versionesExplorer = useVersionesExplorer(vm.versiones.lista);

  const periodToolbar = (
    <NominaExplorerToolbar
      layout="periodos"
      controls={[
        {
          kind: 'search',
          label: 'Búsqueda',
          placeholder: 'Buscar por ID, año o quincena',
          value: periodosExplorer.query,
          onChange: periodosExplorer.setQuery,
        },
        {
          kind: 'select',
          label: 'Quincena',
          value: periodosExplorer.quincenaFilter,
          onChange: periodosExplorer.setQuincenaFilter,
          options: [
            { label: 'Todas', value: 'all' },
            ...periodosExplorer.quincenaOptions.map((value) => ({
              label: `Q${value}`,
              value: String(value),
            })),
          ],
        },
        {
          kind: 'select',
          label: 'Orden',
          value: periodosExplorer.sort,
          onChange: (value) => periodosExplorer.setSort(value as 'asc' | 'desc'),
          withOrderIcon: true,
          options: [
            { label: 'Mayor ID primero', value: 'desc' },
            { label: 'Menor ID primero', value: 'asc' },
          ],
        },
      ]}
      onCreate={vm.openCreateModal}
    />
  );

  const versionToolbar = (
    <NominaExplorerToolbar
      layout="versiones"
      controls={[
        {
          kind: 'search',
          label: 'Búsqueda',
          placeholder: 'Buscar por versión, período o etapa',
          value: versionesExplorer.query,
          onChange: versionesExplorer.setQuery,
        },
        {
          kind: 'select',
          label: 'Etapa',
          value: versionesExplorer.stageFilter,
          onChange: versionesExplorer.setStageFilter,
          options: [
            { label: 'Todas', value: 'all' },
            ...versionesExplorer.stageOptions.map((value) => ({
              label: value,
              value,
            })),
          ],
        },
        {
          kind: 'select',
          label: 'Estatus',
          value: versionesExplorer.statusFilter,
          onChange: versionesExplorer.setStatusFilter,
          options: [
            { label: 'Todos', value: 'all' },
            ...versionesExplorer.statusOptions.map((value) => ({
              label: value,
              value,
            })),
          ],
        },
        {
          kind: 'select',
          label: 'Orden',
          value: versionesExplorer.sort,
          onChange: (value) => versionesExplorer.setSort(value as 'asc' | 'desc'),
          withOrderIcon: true,
          options: [
            { label: 'Mayor versión primero', value: 'desc' },
            { label: 'Menor versión primero', value: 'asc' },
          ],
        },
      ]}
      onCreate={vm.openCreateModal}
    />
  );

  return (
    <AdminPageShell>
      <NominaHero
        title="Gestión de períodos y versiones"
        subtitle={
          <>
            <strong>Primero crea o selecciona un período.</strong> Después podrás
            registrar <em>una versión asociada a ese período</em>.
          </>
        }
      />

      <NominaEntityCards
        activeEntity={vm.activeEntity}
        hasPeriodos={vm.periodos.lista.length > 0}
        onSelect={vm.handleSelectEntity}
      />

      {vm.activeError ? (
        <AdminInlineMessage title="Ocurrió un problema" tone="error">
          {vm.activeError}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface as="section" className={s.contentShell}>
        {vm.activeEntity === 'periodo' ? (
          <PeriodosTable
            items={periodosExplorer.filteredItems}
            metaText={periodosExplorer.metaText}
            selectedId={vm.periodos.detalle?.periodId ?? null}
            onSelect={vm.handleSelectPeriodo}
            toolbar={periodToolbar}
            emptyState={
              vm.periodos.lista.length > 0 ? (
                <NominaEmptyState
                  title="Sin coincidencias"
                  description="Prueba con otra búsqueda, cambia la quincena o modifica el orden para volver a ver registros."
                  variant="inbox"
                  tone="compact"
                />
              ) : (
                <NominaEmptyState
                  title="Sin períodos registrados"
                  description="Cuando existan períodos de nómina, aparecerán aquí para compararlos y seleccionar uno."
                  variant="inbox"
                  tone="compact"
                />
              )
            }
          />
        ) : null}

        {vm.activeEntity === 'version' ? (
          <VersionesTable
            items={versionesExplorer.filteredItems}
            metaText={versionesExplorer.metaText}
            selectedId={vm.versiones.detalle?.versionId ?? null}
            onSelect={vm.handleSelectVersion}
            toolbar={versionToolbar}
            emptyState={
              vm.versiones.lista.length > 0 ? (
                <NominaEmptyState
                  title="Sin coincidencias"
                  description="Prueba con otra búsqueda, cambia la etapa o ajusta el estatus para volver a ver registros."
                  variant="inbox"
                  tone="compact"
                />
              ) : (
                <NominaEmptyState
                  title="Sin versiones registradas"
                  description="Cuando existan versiones de nómina, aparecerán aquí para explorarlas y seleccionar una."
                  variant="inbox"
                  tone="compact"
                />
              )
            }
          />
        ) : null}
      </AdminSurface>

      {vm.isCreateModalOpen ? (
        <div className={s.modalOverlay} onClick={vm.closeCreateModal} role="presentation">
          <div
            className={s.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="nomina-create-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={s.modalHeader}>
              <div className={s.modalHeaderCopy}>
                <span className={s.modalEyebrow}>{getContentEyebrow(vm.activeEntity)}</span>
                <h3 id="nomina-create-modal-title">{getContentTitle(vm.activeEntity)}</h3>
                <p className={s.modalDescription}>
                  {vm.activeEntity === 'periodo'
                    ? 'Captura las fechas clave para registrar o recuperar el período de nómina.'
                    : 'Define el período de pago, la etapa y las notas para crear una nueva versión.'}
                </p>
              </div>

              <button
                type="button"
                className={s.modalClose}
                onClick={vm.closeCreateModal}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className={s.modalBody}>
              {vm.activeEntity === 'periodo' ? (
                <PeriodoCreateForm
                  loading={vm.periodos.loadingCreate}
                  onSubmit={vm.handleCreatePeriodo}
                />
              ) : null}

              {vm.activeEntity === 'version' ? (
                <VersionCreateForm
                  loading={vm.versiones.loadingCreate}
                  periodos={vm.periodos.lista}
                  onSubmit={vm.handleCreateVersion}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </AdminPageShell>
  );
}
