'use client';

import s from './NominaCargasView.module.css';

import CatalogoResultadoPanel from './components/CatalogoResultadoPanel';
import EmptyState from './components/EmptyState';
import NominaCargaContentHeader from './components/NominaCargaContentHeader';
import NominaCargaEntityCards from './components/NominaCargaEntityCards';
import NominaCargaToolbar from './components/NominaCargaToolbar';
import NominaCargaUploadModal from './components/NominaCargaUploadModal';
import NominaCargasHero from './components/NominaCargasHero';
import NominaResultadoPanel from './components/NominaResultadoPanel';
import { useNominaCargasView } from './hooks/useNominaCargasView';
import {
  getContentEyebrow,
  getContentTitle,
  getEmptyDescription,
  getEmptyTitle,
} from './utils/nomina-cargas.utils';

export default function NominaCargasView() {
  const vm = useNominaCargasView();

  return (
    <section className={s.page}>
      <div className={s.stack}>
        <NominaCargasHero />

        <NominaCargaEntityCards
          activeEntity={vm.activeEntity}
          onSelect={vm.handleSelectEntity}
        />

      <NominaCargaToolbar
      activeEntity={vm.activeEntity}
      searchFileId={vm.searchFileId}
      loading={vm.currentLoading}
      canExecute={vm.canExecute}
      onSearchFileIdChange={vm.setSearchFileId}
      onExecute={vm.handleExecute}
      onPrimaryAction={vm.openUploadModal}
    />

        {vm.activeError ? (
          <div className={s.errorBanner} role="alert">
            <span className={s.errorTitle}>Ocurrió un problema</span>
            <p>{vm.activeError}</p>
          </div>
        ) : null}

        {vm.consultMessage ? (
          <div className={s.infoBanner}>
            <span className={s.infoTitle}>Consulta visual preparada</span>
            <p>{vm.consultMessage}</p>
          </div>
        ) : null}

        <section
          className={`${s.contentShell} ${
            vm.shouldDimContent ? s.contentShellIdle : ''
          }`}
        >
          <NominaCargaContentHeader
            eyebrow={getContentEyebrow(vm.activeEntity)}
            title={getContentTitle(vm.activeEntity)}
          />

          {vm.activeEntity === 'catalogo' ? (
            vm.catalogo.archivo || vm.catalogo.ejecucion ? (
              <CatalogoResultadoPanel
                archivo={vm.catalogo.archivo}
                ejecucion={vm.catalogo.ejecucion}
              />
            ) : (
              <EmptyState
                title={getEmptyTitle('catalogo')}
                description={getEmptyDescription('catalogo')}
              />
            )
          ) : null}

          {vm.activeEntity === 'nomina' ? (
            vm.nomina.ejecucion ? (
              <NominaResultadoPanel detalle={vm.nomina.ejecucion} />
            ) : (
              <EmptyState
                title={getEmptyTitle('nomina')}
                description={getEmptyDescription('nomina')}
              />
            )
          ) : null}
        </section>
      </div>

      <NominaCargaUploadModal
        open={vm.isUploadModalOpen}
        entity={vm.activeEntity}
        form={vm.modalForm}
        status={vm.modalStatus}
        error={vm.modalError}
        loadingUpload={vm.catalogo.loadingUpload}
        loadingRun={
          vm.activeEntity === 'catalogo'
            ? vm.catalogo.loadingRun
            : vm.nomina.loadingRun
        }
        onClose={vm.closeUploadModal}
        onFieldChange={vm.updateModalField}
        onFileTypeChange={vm.setModalFileType}
        onSubmit={vm.handleUploadAndRun}
      />
    </section>
  );
}