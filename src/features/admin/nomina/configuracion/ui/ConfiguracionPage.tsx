'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';
import { CalendarRange, Layers3, X } from 'lucide-react';

import { useConfiguracionController } from '../application/useConfiguracionController';
import {
  getContentEyebrow,
  getContentTitle,
  getDetailDescription,
  getSearchButtonLabel,
  getSearchLabel,
  getSearchPlaceholder,
} from '../model/configuracion.selectors';
import NominaConfigToolbar from './components/NominaConfigToolbar';
import NominaEntityCards from './components/NominaEntityCards';
import PeriodosTable from './components/PeriodosTable';
import PeriodoCreateForm from './components/PeriodoCreateForm';
import PeriodoResultadoPanel from './components/PeriodoResultadoPanel';
import VersionesTable from './components/VersionesTable';
import VersionCreateForm from './components/VersionCreateForm';
import VersionResultadoPanel from './components/VersionResultadoPanel';
import s from './ConfiguracionPage.module.css';

export default function ConfiguracionPage() {
  const vm = useConfiguracionController();
  const hasRows =
    vm.activeEntity === 'periodo'
      ? vm.periodos.lista.length > 0
      : vm.versiones.lista.length > 0;

  return (
    <AdminPageShell>
      <NominaHero
        kicker="Nómina"
        title="Gestión de períodos y versiones"
        subtitle="Consulta, crea y organiza la configuración base del procesamiento de nómina."
        badges={[
          { icon: CalendarRange, label: 'Período' },
          { icon: Layers3, label: 'Versión' },
        ]}
        spacious
      />

      <NominaEntityCards
        activeEntity={vm.activeEntity}
        onSelect={vm.handleSelectEntity}
      />

      <NominaConfigToolbar
        searchLabel={getSearchLabel(vm.activeEntity)}
        searchPlaceholder={getSearchPlaceholder(vm.activeEntity)}
        searchButtonLabel={getSearchButtonLabel(vm.activeEntity)}
        searchId={vm.searchId}
        loading={vm.currentLoadingSearch}
        canSearch={vm.canSearch}
        onSearchIdChange={vm.setSearchId}
        onSearch={vm.handleSearch}
        onCreate={vm.openCreateModal}
      />

      {vm.activeError ? (
        <AdminInlineMessage title="Ocurrió un problema" tone="error">
          {vm.activeError}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface as="section" className={s.contentShell}>
        {vm.activeEntity === 'periodo' ? (
          vm.periodos.lista.length > 0 ? (
            <PeriodosTable
              items={vm.periodos.lista}
              selectedId={vm.periodos.detalle?.periodId ?? null}
              onSelect={vm.handleSelectPeriodo}
            />
          ) : (
            <NominaEmptyState
              title="Sin períodos registrados"
              description="Cuando existan períodos de nómina, aparecerán aquí para compararlos y seleccionar uno."
              variant="inbox"
              tone="compact"
            />
          )
        ) : null}

        {vm.activeEntity === 'version' ? (
          vm.versiones.lista.length > 0 ? (
            <VersionesTable
              items={vm.versiones.lista}
              selectedId={vm.versiones.detalle?.versionId ?? null}
              onSelect={vm.handleSelectVersion}
            />
          ) : (
            <NominaEmptyState
              title="Sin versiones registradas"
              description="Cuando existan versiones de nómina, aparecerán aquí para explorarlas y seleccionar una."
              variant="inbox"
              tone="compact"
            />
          )
        ) : null}

        <NominaSectionHeader
          eyebrow={getContentEyebrow(vm.activeEntity)}
          title={getContentTitle(vm.activeEntity, 'resultados')}
          description={getDetailDescription(vm.activeEntity, hasRows)}
        />

        {vm.activeEntity === 'periodo' ? (
          vm.periodos.detalle ? (
            <PeriodoResultadoPanel detalle={vm.periodos.detalle} />
          ) : (
            <NominaEmptyState
              title="Sin selección todavía"
              description={
                hasRows
                  ? 'Selecciona un período de la tabla superior para revisar su detalle completo.'
                  : 'Crea un nuevo período o espera a que existan registros para ver el detalle aquí.'
              }
            />
          )
        ) : null}

        {vm.activeEntity === 'version' ? (
          vm.versiones.detalle ? (
            <VersionResultadoPanel detalle={vm.versiones.detalle} />
          ) : (
            <NominaEmptyState
              title="Sin selección todavía"
              description={
                hasRows
                  ? 'Selecciona una versión de la tabla superior para revisar su detalle completo.'
                  : 'Crea una nueva versión o espera a que existan registros para ver el detalle aquí.'
              }
            />
          )
        ) : null}
      </AdminSurface>

      {vm.isCreateModalOpen ? (
        <div
          className={s.modalOverlay}
          onClick={vm.closeCreateModal}
          role="presentation"
        >
          <div
            className={s.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="nomina-create-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={s.modalHeader}>
              <div className={s.modalHeaderCopy}>
                <span className={s.modalEyebrow}>
                  {getContentEyebrow(vm.activeEntity)}
                </span>
                <h3 id="nomina-create-modal-title">
                  {getContentTitle(vm.activeEntity, 'crear')}
                </h3>
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
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className={s.modalBody}>
              {vm.activeEntity === 'periodo' ? (
                <PeriodoCreateForm
                  loading={vm.periodos.loadingCreate}
                  ultimoCreado={null}
                  onSubmit={vm.handleCreatePeriodo}
                />
              ) : null}

              {vm.activeEntity === 'version' ? (
                <VersionCreateForm
                  loading={vm.versiones.loadingCreate}
                  ultimaCreada={null}
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
