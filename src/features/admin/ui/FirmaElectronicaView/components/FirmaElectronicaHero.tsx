import { FileSignature, Plus } from 'lucide-react';
import s from './FirmaElectronicaHero.module.css';

type Props = {
  onOpenCreateModal: () => void;
};

export default function FirmaElectronicaHero({
  onOpenCreateModal,
}: Props) {
  return (
    <header className={s.hero}>
      <div className={s.content}>
        <div className={s.kickerRow}>
          <span className={s.kicker}>Firma electrónica</span>
          <span className={s.badge}>
            <FileSignature size={14} />
            Solicitudes de firma
          </span>
        </div>

        <div className={s.copy}>
          <h1>Gestión de solicitudes de firma</h1>
          <p>
            Consulta solicitudes, filtra por estatus y revisa el detalle
            operativo y técnico de cada documento firmado.
          </p>
        </div>
      </div>

      <div className={s.actions}>
        <button
          type="button"
          className={s.primaryBtn}
          onClick={onOpenCreateModal}
        >
          <Plus size={16} />
          Nueva solicitud
        </button>
      </div>
    </header>
  );
}