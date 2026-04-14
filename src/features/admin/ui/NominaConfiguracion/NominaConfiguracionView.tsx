'use client';

import s from './NominaConfiguracionView.module.css';

import NominaConfigHero from './components/NominaConfigHero';
import NominaEntityCards from './components/NominaEntityCards';
import NominaConfigToolbar from './components/NominaConfigToolbar';
import NominaContentHeader from './components/NominaContentHeader';
import EmptyState from './components/EmptyState';
import PeriodoCreateForm from './components/PeriodoCreateForm';
import VersionCreateForm from './components/VersionCreateForm';
import PeriodoResultadoPanel from './components/PeriodoResultadoPanel';
import VersionResultadoPanel from './components/VersionResultadoPanel';

import {
  getContentEyebrow,
  getContentTitle,
  getSearchButtonLabel,
  getSearchLabel,
  getSearchPlaceholder,
} from './utils/nomina-configuracion.utils';

import { useNominaConfiguracionView } from './hooks/useNominaConfiguracionView';

export default function NominaConfiguracionView() {
  const vm = useNominaConfiguracionView();

  return (
    <section className={s.page}>
      <div className={s.stack}>
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
          <div className={s.errorBanner} role="alert">
            <span className={s.errorTitle}>Ocurrió un problema</span>
            <p>{vm.activeError}</p>
          </div>
        ) : null}

        <section className={s.contentShell}>
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
                title="Sin consulta todavía"
                description="Usa la barra superior para buscar un periodo por ID o crea uno nuevo desde esta misma sesión."
              />
            )
          ) : null}

          {vm.activeEntity === 'version' ? (
            vm.versiones.detalle ? (
              <VersionResultadoPanel detalle={vm.versiones.detalle} />
            ) : (
              <EmptyState
                title="Sin consulta todavía"
                description="Consulta una versión por ID o crea una nueva versión asociada a un periodo existente."
              />
            )
          ) : null}
        </section>
      </div>

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
                ×
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
    </section>
  );
}