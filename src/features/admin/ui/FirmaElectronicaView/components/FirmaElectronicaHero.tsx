import { FileSignature, Plus, ShieldCheck } from 'lucide-react';
import s from './FirmaElectronicaHero.module.css';

type Props = {
  onOpenCreateModal: () => void;
};

export default function FirmaElectronicaHero({
  onOpenCreateModal,
}: Props) {
  return (
    <header className={s.hero}>
      <div className={s.topRow}>
        <div className={s.leftBlock}>
          <span className={s.kicker}>Firma electrónica</span>

        </div>

        <div className={s.rightBlock}>
          <button
            type="button"
            className={s.primaryBtn}
            onClick={onOpenCreateModal}
          >
            <Plus size={16} />
            Nueva solicitud
          </button>
        </div>
      </div>

      <div className={s.textBlock}>
        <h1 className={s.title}>Firma electrónica</h1>

        <p className={s.subtitle}>
          Gestiona solicitudes de firma, consulta su estatus y revisa el detalle
          técnico de cada documento firmado.
        </p>
      </div>
    </header>
  );
}