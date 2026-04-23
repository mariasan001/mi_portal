'use client';

import AdminInlineMessage from '../../shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '../../shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '../../shared/ui/AdminSurface/AdminSurface';
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
    <AdminPageShell>
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
        <AdminInlineMessage title="Ocurrió un problema" tone="error">
          {vm.activeError}
        </AdminInlineMessage>
      ) : null}

      {vm.consultMessage ? (
        <AdminInlineMessage title="Consulta visual preparada">
          {vm.consultMessage}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface
        as="section"
        className={s.contentShell}
        idle={vm.shouldDimContent}
        dimmed={vm.shouldDimContent}
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
      </AdminSurface>

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
    </AdminPageShell>
  );
}
