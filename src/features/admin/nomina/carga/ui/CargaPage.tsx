'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';

import { useCargaController } from '../application/useCargaController';
import ArchivosNominaTable from './components/ArchivosNominaTable';
import NominaCargaEntityCards from './components/NominaCargaEntityCards';
import NominaCargaExplorerToolbar from './components/NominaCargaExplorerToolbar';
import NominaCargaUploadModal from './components/NominaCargaUploadModal';
import s from './CargaPage.module.css';

export default function CargaPage() {
  const vm = useCargaController();

  const toolbar = (
    <NominaCargaExplorerToolbar
      query={vm.filesExplorer.query}
      stageOptions={vm.filesExplorer.stageOptions}
      stageValue={vm.filesExplorer.stageFilter}
      statusOptions={vm.filesExplorer.statusOptions}
      statusValue={vm.filesExplorer.statusFilter}
      sortValue={vm.filesExplorer.sort}
      onQueryChange={vm.filesExplorer.setQuery}
      onStageChange={vm.filesExplorer.setStageFilter}
      onStatusChange={vm.filesExplorer.setStatusFilter}
      onSortChange={vm.filesExplorer.setSort}
      onCreate={vm.openUploadModal}
    />
  );

  return (
    <AdminPageShell>
      <NominaHero
        title="Carga de catálogo y nómina"
        subtitle={
          <>
            <strong>Primero carga y ejecuta el catálogo.</strong> Después podrás
            continuar con <em>el archivo de nómina asociado</em>.
          </>
        }
      />

      <NominaCargaEntityCards
        activeEntity={vm.activeEntity}
        onSelect={vm.handleSelectEntity}
      />

      {vm.activeError ? (
        <AdminInlineMessage title="Ocurrió un problema" tone="error">
          {vm.activeError}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface as="section" className={s.contentShell}>
        <ArchivosNominaTable
          entity={vm.activeEntity}
          items={vm.filesExplorer.filteredItems}
          metaText={vm.filesExplorer.metaText}
          loading={vm.currentLoading}
          onRun={vm.handleExecuteFile}
          runLabel={vm.activeEntity === 'catalogo' ? 'Ejecutar catálogo' : 'Ejecutar nómina'}
          toolbar={toolbar}
          emptyState={
            vm.archivos.lista.length > 0 ? (
              <NominaEmptyState
                title="Sin coincidencias"
                description="Prueba con otra búsqueda, cambia la etapa o ajusta el estatus para volver a ver archivos."
                variant="inbox"
                tone="compact"
              />
            ) : (
              <NominaEmptyState
                title="Sin archivos registrados"
                description="Cuando existan archivos de nómina o catálogo, aparecerán aquí para operarlos desde una sola vista."
                variant="inbox"
                tone="compact"
              />
            )
          }
        />
      </AdminSurface>

      <NominaCargaUploadModal
        open={vm.isUploadModalOpen}
        entity={vm.activeEntity}
        form={vm.modalForm}
        status={vm.modalStatus}
        error={vm.modalError}
        loadingUpload={vm.catalogo.loadingUpload}
        loadingRun={vm.activeEntity === 'catalogo' ? vm.catalogo.loadingRun : vm.nomina.loadingRun}
        onClose={vm.closeUploadModal}
        onFieldChange={vm.updateModalField}
        onFileTypeChange={vm.setModalFileType}
        onSubmit={vm.handleUploadAndRun}
      />
    </AdminPageShell>
  );
}
