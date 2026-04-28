'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { X } from 'lucide-react';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';

import { useConfiguracionController } from '../application/useConfiguracionController';
import {
  formatNominaCompactPeriod,
  formatNominaTitle,
  getContentEyebrow,
  getContentTitle,
} from '../model/configuracion.selectors';
import NominaEntityCards from './components/NominaEntityCards';
import PeriodosExplorerToolbar from './components/PeriodosExplorerToolbar';
import PeriodosTable from './components/PeriodosTable';
import PeriodoCreateForm from './components/PeriodoCreateForm';
import VersionesExplorerToolbar from './components/VersionesExplorerToolbar';
import VersionesTable from './components/VersionesTable';
import VersionCreateForm from './components/VersionCreateForm';
import s from './ConfiguracionPage.module.css';

export default function ConfiguracionPage() {
  const vm = useConfiguracionController();

  const [periodQuery, setPeriodQuery] = useState('');
  const [periodQuincenaFilter, setPeriodQuincenaFilter] = useState('all');
  const [periodSort, setPeriodSort] = useState<'asc' | 'desc'>('desc');

  const [versionQuery, setVersionQuery] = useState('');
  const [versionStageFilter, setVersionStageFilter] = useState('all');
  const [versionStatusFilter, setVersionStatusFilter] = useState('all');
  const [versionSort, setVersionSort] = useState<'asc' | 'desc'>('desc');

  const deferredPeriodQuery = useDeferredValue(periodQuery);
  const deferredVersionQuery = useDeferredValue(versionQuery);

  const periodQuincenaOptions = useMemo(() => {
    return Array.from(new Set(vm.periodos.lista.map((item) => item.quincena))).sort(
      (a, b) => a - b
    );
  }, [vm.periodos.lista]);

  const filteredPeriodos = useMemo(() => {
    const normalizedQuery = deferredPeriodQuery.trim().toLowerCase();

    const filtered = vm.periodos.lista.filter((item) => {
      if (periodQuincenaFilter !== 'all') {
        const expected = Number(periodQuincenaFilter);
        if (item.quincena !== expected) return false;
      }

      if (!normalizedQuery) return true;

      const periodText = formatNominaCompactPeriod(
        item.anio,
        item.quincena,
        item.periodoCode
      ).toLowerCase();

      return [
        String(item.periodId),
        String(item.anio),
        String(item.quincena),
        `q${item.quincena}`,
        periodText,
      ].some((value) => value.includes(normalizedQuery));
    });

    return filtered.sort((a, b) =>
      periodSort === 'asc' ? a.periodId - b.periodId : b.periodId - a.periodId
    );
  }, [deferredPeriodQuery, periodQuincenaFilter, periodSort, vm.periodos.lista]);

  const versionStageOptions = useMemo(() => {
    const knownStages = ['Previa', 'Integrada'];
    const presentStages = vm.versiones.lista.map((item) => formatNominaTitle(item.stage));

    return Array.from(new Set([...knownStages, ...presentStages]));
  }, [vm.versiones.lista]);

  const versionStatusOptions = useMemo(() => {
    return Array.from(
      new Set(vm.versiones.lista.map((item) => formatNominaTitle(item.status)))
    );
  }, [vm.versiones.lista]);

  const filteredVersiones = useMemo(() => {
    const normalizedQuery = deferredVersionQuery.trim().toLowerCase();

    const filtered = vm.versiones.lista.filter((item) => {
      const stageText = formatNominaTitle(item.stage);
      const statusText = formatNominaTitle(item.status);

      if (versionStageFilter !== 'all' && stageText !== versionStageFilter) {
        return false;
      }

      if (versionStatusFilter !== 'all' && statusText !== versionStatusFilter) {
        return false;
      }

      if (!normalizedQuery) return true;

      const periodText = formatNominaCompactPeriod(item.anio, item.quincena, item.periodCode);

      return [
        String(item.versionId),
        String(item.payPeriodId),
        String(item.anio ?? ''),
        String(item.quincena ?? ''),
        periodText,
        stageText,
        statusText,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });

    return filtered.sort((a, b) =>
      versionSort === 'asc' ? a.versionId - b.versionId : b.versionId - a.versionId
    );
  }, [
    deferredVersionQuery,
    versionSort,
    versionStageFilter,
    versionStatusFilter,
    vm.versiones.lista,
  ]);

  const periodToolbar = (
    <PeriodosExplorerToolbar
      query={periodQuery}
      quincenaOptions={periodQuincenaOptions}
      quincenaValue={periodQuincenaFilter}
      sortValue={periodSort}
      onQueryChange={setPeriodQuery}
      onQuincenaChange={setPeriodQuincenaFilter}
      onSortChange={setPeriodSort}
      onCreate={vm.openCreateModal}
    />
  );

  const versionToolbar = (
    <VersionesExplorerToolbar
      query={versionQuery}
      stageOptions={versionStageOptions}
      stageValue={versionStageFilter}
      statusOptions={versionStatusOptions}
      statusValue={versionStatusFilter}
      sortValue={versionSort}
      onQueryChange={setVersionQuery}
      onStageChange={setVersionStageFilter}
      onStatusChange={setVersionStatusFilter}
      onSortChange={setVersionSort}
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
            items={filteredPeriodos}
            metaText={
              filteredPeriodos.length === vm.periodos.lista.length
                ? `${vm.periodos.lista.length} registros`
                : `${filteredPeriodos.length} de ${vm.periodos.lista.length} registros`
            }
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
            items={filteredVersiones}
            metaText={
              filteredVersiones.length === vm.versiones.lista.length
                ? `${vm.versiones.lista.length} registros`
                : `${filteredVersiones.length} de ${vm.versiones.lista.length} registros`
            }
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
                <span className={s.modalEyebrow}>{getContentEyebrow(vm.activeEntity)}</span>
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
                  periodos={vm.periodos.lista}
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
