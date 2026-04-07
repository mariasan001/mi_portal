'use client';

import FirmaElectronicaHero from './components/FirmaElectronicaHero';
import FirmaSolicitudesToolbar from './components/FirmaSolicitudesToolbar';
import FirmaSolicitudesTable from './components/FirmaSolicitudesTable';
import FirmaSolicitudDetalleCard from './components/FirmaSolicitudDetalleCard';
import FirmaDetalleTecnicoCard from './components/FirmaDetalleTecnicoCard';
import FirmaCrearSolicitudModal from './components/FirmaCrearSolicitudModal';
import EmptyFirmaState from './components/EmptyFirmaState';
import s from './FirmaElectronicaView.module.css';
import { useFirmaElectronicaView } from './hook/useFirmaElectronicaView';

export default function FirmaElectronicaView() {
  const vm = useFirmaElectronicaView();

  const hasSelection =
    Boolean(vm.detalle.data?.data) || Boolean(vm.detalleTecnico.data?.data);

  return (
    <section className={s.page}>
      <div className={s.stack}>
        <FirmaElectronicaHero
          onOpenCreateModal={vm.handleOpenCreateModal}
        />

        <div className={s.workspace}>
          <section className={s.tableSection}>
            <div className={s.sectionCard}>
              <div className={s.sectionHeader}>
                <div>
                  <h2>Solicitudes registradas</h2>
                  <p>
                    Consulta el flujo principal de solicitudes y da clic sobre
                    una fila para revisar su detalle.
                  </p>
                </div>
              </div>

              <FirmaSolicitudesToolbar
                status={vm.statusFilter}
                loading={vm.listado.loading}
                onChangeStatus={vm.setStatusFilter}
                onLoad={vm.handleLoadList}
              />

              {vm.listado.error ? (
                <p className={s.feedback}>{vm.listado.error}</p>
              ) : null}

              {!vm.listado.data?.data?.length ? (
                <div className={s.emptyTableWrap}>
                  <EmptyFirmaState />
                </div>
              ) : (
                <FirmaSolicitudesTable
                  items={vm.listado.data.data}
                  selectedRequestId={vm.requestId}
                  onSelectRequest={vm.handleSelectRequest}
                />
              )}
            </div>
          </section>

          <aside className={s.detailSection}>
            {hasSelection ? (
              <>
                <FirmaSolicitudDetalleCard
                  loading={vm.detalle.loading}
                  error={vm.detalle.error}
                  data={vm.detalle.data?.data ?? null}
                />

                <FirmaDetalleTecnicoCard
                  loading={vm.detalleTecnico.loading}
                  error={vm.detalleTecnico.error}
                  data={vm.detalleTecnico.data?.data ?? null}
                />
              </>
            ) : (
              <EmptyFirmaState />
            )}
          </aside>
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