'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';
import { Database, FileArchive, PlayCircle } from 'lucide-react';
import s from './CargaPage.module.css';
import CatalogoResultadoPanel from './components/CatalogoResultadoPanel';
import NominaCargaEntityCards from './components/NominaCargaEntityCards';
import NominaCargaToolbar from './components/NominaCargaToolbar';
import NominaCargaUploadModal from './components/NominaCargaUploadModal';
import NominaResultadoPanel from './components/NominaResultadoPanel';
import { useNominaCargasView } from './hooks/useNominaCargasView';
import {
  getContentEyebrow,
  getContentTitle,
  getEmptyDescription,
  getEmptyTitle,
} from './utils/nomina-cargas.utils';

export default function CargaPage() {
  const vm = useNominaCargasView();

  return (
    <AdminPageShell>
      <NominaHero
        kicker="Nomina"
        title="Carga de catalogo y nomina"
        subtitle="Sube, ejecuta y da seguimiento a archivos operativos del flujo de catalogo y staging de nomina desde una sola sesion."
        badges={[
          { icon: FileArchive, label: 'Catalogo' },
          { icon: Database, label: 'Nomina' },
          { icon: PlayCircle, label: 'Procesamiento' },
        ]}
        spacious
      />

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
        <NominaSectionHeader
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
            <NominaEmptyState
              title={getEmptyTitle('catalogo')}
              description={getEmptyDescription('catalogo')}
            />
          )
        ) : null}

        {vm.activeEntity === 'nomina' ? (
          vm.nomina.ejecucion ? (
            <NominaResultadoPanel detalle={vm.nomina.ejecucion} />
          ) : (
            <NominaEmptyState
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
