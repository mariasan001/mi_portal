'use client';

import FirmaElectronicaHero from './components/FirmaElectronicaHero';
import FirmaSolicitudesPanel from './components/FirmaSolicitudesPanel';
import FirmaSolicitudDetalleCard from './components/FirmaSolicitudDetalleCard';
import FirmaDetalleTecnicoCard from './components/FirmaDetalleTecnicoCard';
import FirmaCrearSolicitudModal from './components/FirmaCrearSolicitudModal';
import s from './FirmaElectronicaView.module.css';
import { useFirmaElectronicaView } from './hook/useFirmaElectronicaView';

export default function FirmaElectronicaView() {
  const vm = useFirmaElectronicaView();

  /**
   * Ya no existe wrapper .data.data en la vista.
   * Si hay detalle o detalle técnico, mostramos la sección inferior.
   */
  const hasSelection =
    Boolean(vm.detalle.data) || Boolean(vm.detalleTecnico.data);

  return (
    <section className={s.page}>
      <div className={s.stack}>
        <FirmaElectronicaHero onOpenCreateModal={vm.handleOpenCreateModal} />

        <div className={s.workspace}>
          <section className={s.tableSection}>
            <FirmaSolicitudesPanel
              status={vm.statusFilter}
              loading={vm.listado.loading}
              error={vm.listado.error}
              items={vm.listado.data ?? []}
              selectedRequestId={vm.requestId}
              onChangeStatus={vm.setStatusFilter}
              onLoad={vm.handleLoadList}
              onSelectRequest={vm.handleSelectRequest}
            />
          </section>

          {hasSelection ? (
            <section className={s.detailsSection}>
              <FirmaSolicitudDetalleCard
                loading={vm.detalle.loading}
                error={vm.detalle.error}
                data={vm.detalle.data ?? null}
              />

              <FirmaDetalleTecnicoCard
                loading={vm.detalleTecnico.loading}
                error={vm.detalleTecnico.error}
                data={vm.detalleTecnico.data ?? null}
              />
            </section>
          ) : null}
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
      </div>
    </section>
  );
}