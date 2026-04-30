'use client';

import { AlertTriangle, ChevronDown, Eye } from 'lucide-react';

import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';

import { useProcesamientoController } from '../application/useProcesamientoController';
import NominaProcesamientoErrorsTable from './components/NominaProcesamientoErrorsTable';
import NominaProcesamientoPreviewTable from './components/NominaProcesamientoPreviewTable';
import NominaProcesamientoSummaryPanel from './components/NominaProcesamientoSummaryPanel';
import NominaProcesamientoToolbar from './components/NominaProcesamientoToolbar';
import s from './ProcesamientoPage.module.css';

export default function ProcesamientoPage() {
  const vm = useProcesamientoController();
  const hasAnyConsulted =
    vm.hasConsultedSummary || vm.hasConsultedPreview || vm.hasConsultedErrors;
  const showInitialEmpty =
    !hasAnyConsulted &&
    !vm.summary &&
    vm.previewRows.length === 0 &&
    vm.errorRows.length === 0;

  return (
    <AdminPageShell>
      <NominaHero
        title="Revision del procesamiento"
        subtitle={
          <>
            <strong>Primero selecciona el archivo que quieres revisar.</strong> Despues podras
            consultar <em>su resumen, vista previa y filas con error en una sola vista</em>.
          </>
        }
      />

      {vm.currentError ? (
        <AdminInlineMessage title="Ocurrio un problema" tone="error">
          {vm.currentError}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface
        as="div"
        className={s.contentShell}
        idle={!vm.hasConsultedSummary && !vm.hasConsultedPreview && !vm.hasConsultedErrors}
        dimmed={!vm.hasConsultedSummary && !vm.hasConsultedPreview && !vm.hasConsultedErrors}
      >
        <NominaProcesamientoToolbar
          periodFilter={vm.periodFilter}
          periodOptions={vm.periodOptions}
          nameFilter={vm.nameFilter}
          nameOptions={vm.nameOptions}
          loading={vm.loading}
          onPeriodFilterChange={vm.setPeriodFilter}
          onNameFilterChange={vm.setNameFilter}
        />

        <div className={s.resultCard}>
          {showInitialEmpty ? (
            <div className={s.emptyArea}>
              <NominaEmptyState
                title="Aun no has consultado ningun archivo"
                description="Selecciona un periodo y un nombre para revisar el resumen, la vista previa y los errores del archivo procesado."
                variant="inbox"
                tone="compact"
              />
            </div>
          ) : null}

          {!showInitialEmpty ? (
            <section className={s.resultSection}>
              {vm.summary ? (
                <NominaProcesamientoSummaryPanel
                  detalle={vm.summary}
                  archivo={vm.selectedFile}
                />
              ) : (
                <div className={s.emptyBlock}>
                  <NominaEmptyState
                    title="Aun no has consultado ningun resumen"
                    description="Selecciona un archivo valido para revisar las metricas generales del archivo procesado."
                    variant={vm.hasConsultedSummary ? 'search' : 'inbox'}
                  />
                </div>
              )}
            </section>
          ) : null}

          {!showInitialEmpty && vm.previewRows.length ? (
            <section className={s.resultSection}>
              <details className={s.accordion}>
                <summary className={s.accordionSummary}>
                  <div className={s.accordionIdentity}>
                    <span className={s.accordionIcon}>
                      <Eye size={15} />
                    </span>
                    <div className={s.accordionCopy}>
                      <strong>Vista previa</strong>
                      <span>Muestra operativa del archivo procesado</span>
                    </div>
                  </div>

                  <div className={s.accordionMeta}>
                    <span className={s.accordionBadge}>
                      {vm.previewRows.length} filas
                    </span>
                    <span className={s.accordionChevron} aria-hidden="true">
                      <ChevronDown size={16} />
                    </span>
                  </div>
                </summary>

                <div className={s.accordionBody}>
                  <NominaProcesamientoPreviewTable
                    key={`preview-${vm.selectedFileId}`}
                    rows={vm.previewRows}
                  />
                </div>
              </details>
            </section>
          ) : null}

          {!showInitialEmpty && vm.errorRows.length ? (
            <section className={s.resultSection}>
              <details className={s.accordion}>
                <summary className={s.accordionSummary}>
                  <div className={s.accordionIdentity}>
                    <span className={`${s.accordionIcon} ${s.accordionIconDanger}`}>
                      <AlertTriangle size={15} />
                    </span>
                    <div className={s.accordionCopy}>
                      <strong>Errores</strong>
                      <span>Filas con incidencias detectadas</span>
                    </div>
                  </div>

                  <div className={s.accordionMeta}>
                    <span className={`${s.accordionBadge} ${s.accordionBadgeDanger}`}>
                      {vm.errorRows.length} error{vm.errorRows.length === 1 ? '' : 'es'}
                    </span>
                    <span className={s.accordionChevron} aria-hidden="true">
                      <ChevronDown size={16} />
                    </span>
                  </div>
                </summary>

                <div className={s.accordionBody}>
                  <NominaProcesamientoErrorsTable
                    key={`errors-${vm.selectedFileId}`}
                    rows={vm.errorRows}
                  />
                </div>
              </details>
            </section>
          ) : null}
        </div>
      </AdminSurface>
    </AdminPageShell>
  );
}
