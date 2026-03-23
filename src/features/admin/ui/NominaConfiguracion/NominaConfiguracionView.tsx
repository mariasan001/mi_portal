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
        onCreate={() => vm.setMode('crear')}
      />

      {vm.activeError ? <p className={s.errorBanner}>{vm.activeError}</p> : null}

      <section className={s.contentShell}>
        <NominaContentHeader
          eyebrow={getContentEyebrow(vm.activeEntity)}
          title={getContentTitle(vm.activeEntity, vm.mode)}
          showBackButton={vm.mode === 'crear'}
          onBack={() => vm.setMode('resultados')}
        />

        {vm.activeEntity === 'periodo' && vm.mode === 'resultados' ? (
          vm.periodos.detalle ? (
            <PeriodoResultadoPanel detalle={vm.periodos.detalle} />
          ) : (
            <EmptyState
              title="Sin consulta todavía"
              description="Usa la barra superior para buscar un periodo por ID o crea uno nuevo desde esta misma sesión."
            />
          )
        ) : null}

        {vm.activeEntity === 'version' && vm.mode === 'resultados' ? (
          vm.versiones.detalle ? (
            <VersionResultadoPanel detalle={vm.versiones.detalle} />
          ) : (
            <EmptyState
              title="Sin consulta todavía"
              description="Consulta una versión por ID o crea una nueva versión asociada a un periodo existente."
            />
          )
        ) : null}

        {vm.activeEntity === 'periodo' && vm.mode === 'crear' ? (
          <PeriodoCreateForm
            loading={vm.periodos.loadingCreate}
            ultimoCreado={vm.periodos.ultimoCreado}
            onSubmit={vm.handleCreatePeriodo}
          />
        ) : null}

        {vm.activeEntity === 'version' && vm.mode === 'crear' ? (
          <VersionCreateForm
            loading={vm.versiones.loadingCreate}
            ultimaCreada={vm.versiones.ultimaCreada}
            onSubmit={vm.handleCreateVersion}
          />
        ) : null}
      </section>
    </section>
  );
}