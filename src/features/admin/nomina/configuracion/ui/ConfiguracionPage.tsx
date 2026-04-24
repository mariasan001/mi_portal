'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import EmptyState from './components/EmptyState';
import NominaConfigHero from './components/NominaConfigHero';
import NominaConfigToolbar from './components/NominaConfigToolbar';
import NominaContentHeader from './components/NominaContentHeader';
import NominaEntityCards from './components/NominaEntityCards';
import PeriodoCreateForm from './components/PeriodoCreateForm';
import PeriodoResultadoPanel from './components/PeriodoResultadoPanel';
import VersionCreateForm from './components/VersionCreateForm';
import VersionResultadoPanel from './components/VersionResultadoPanel';
import s from './ConfiguracionPage.module.css';
import {
  getContentEyebrow,
  getContentTitle,
  getSearchButtonLabel,
  getSearchLabel,
  getSearchPlaceholder,
} from '../model/configuracion.selectors';
import { useConfiguracionController } from '../application/useConfiguracionController';

export default function ConfiguracionPage() {
  const vm = useConfiguracionController();

  return (
    <AdminPageShell>
      <NominaConfigHero />

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
        <AdminInlineMessage title="Ocurrio un problema" tone="error">
          {vm.activeError}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface as="section" className={s.contentShell}>
        <NominaContentHeader
          eyebrow={getContentEyebrow(vm.activeEntity)}
          title={getContentTitle(vm.activeEntity, 'resultados')}
          showBackButton={false}
        />

        {vm.activeEntity === 'periodo' ? (
          vm.periodos.detalle ? (
            <PeriodoResultadoPanel detalle={vm.periodos.detalle} />
          ) : (
            <EmptyState
              title="Sin consulta todavia"
              description="Usa la barra superior para buscar un periodo por ID o crea uno nuevo desde esta misma sesion."
            />
          )
        ) : null}

        {vm.activeEntity === 'version' ? (
          vm.versiones.detalle ? (
            <VersionResultadoPanel detalle={vm.versiones.detalle} />
          ) : (
            <EmptyState
              title="Sin consulta todavia"
              description="Consulta una version por ID o crea una nueva version asociada a un periodo existente."
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
              </div>

              <button
                type="button"
                className={s.modalClose}
                onClick={vm.closeCreateModal}
                aria-label="Cerrar modal"
              >
                x
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
