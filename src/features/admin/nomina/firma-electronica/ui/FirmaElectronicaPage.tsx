'use client';

import FirmaElectronicaHero from './components/FirmaElectronicaHero';
import FirmaSolicitudesPanel from './components/FirmaSolicitudesPanel';
import FirmaCrearSolicitudModal from './components/FirmaCrearSolicitudModal';
import FirmaDetallesModal from './components/FirmaDetallesModal';
import s from './FirmaElectronicaPage.module.css';
import { useFirmaElectronicaView } from './hook/useFirmaElectronicaView';

export default function FirmaElectronicaPage() {
  const vm = useFirmaElectronicaView();

  return (
    <section className={s.page}>
      <div className={s.stack}>
        <FirmaElectronicaHero />

        <div className={s.workspace}>
          <section className={s.tableSection}>
            <FirmaSolicitudesPanel
              status={vm.statusFilter}
              loading={vm.listado.loading}
              items={vm.listado.data ?? []}
              error={vm.listado.error}
              selectedRequestId={vm.requestId}
              onChangeStatus={vm.setStatusFilter}
              onOpenDetails={vm.handleOpenDetailsModal}
              onViewSignedPdf={vm.handleViewSignedPdfByRequestId}
              onDownloadSignedPdf={vm.handleDownloadSignedPdfByRequestId}
              onOpenCreateModal={vm.handleOpenCreateModal}
            />
          </section>
        </div>

        <FirmaCrearSolicitudModal
          isOpen={vm.isCreateModalOpen}
          file={vm.createForm.file}
          cuts={vm.createForm.cuts}
          contrasena={vm.createForm.contrasena}
          nombre={vm.createForm.nombre}
          descripcion={vm.createForm.descripcion}
          loading={vm.creacion.loading}
          canCreate={vm.canCreate}
          onClose={vm.handleCloseCreateModal}
          onChangeFile={(value) => vm.updateCreateField('file', value)}
          onChangeCuts={(value) => vm.updateCreateField('cuts', value)}
          onChangeContrasena={(value) =>
            vm.updateCreateField('contrasena', value)
          }
          onChangeNombre={(value) => vm.updateCreateField('nombre', value)}
          onChangeDescripcion={(value) =>
            vm.updateCreateField('descripcion', value)
          }
          onSubmit={vm.handleCreate}
        />

        <FirmaDetallesModal
          isOpen={vm.isDetailsModalOpen}
          detalle={vm.detalle.data ?? null}
          detalleTecnico={vm.detalleTecnico.data ?? null}
          detalleLoading={vm.detalle.loading}
          detalleError={vm.detalle.error}
          detalleTecnicoLoading={vm.detalleTecnico.loading}
          detalleTecnicoError={vm.detalleTecnico.error}
          onClose={vm.handleCloseDetailsModal}
        />
      </div>
    </section>
  );
}
