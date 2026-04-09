import { Plus } from 'lucide-react';
import s from './FirmaElectronicaHero.module.css';

type Props = {
  onOpenCreateModal: () => void;
};

export default function FirmaElectronicaHero({
  onOpenCreateModal,
}: Props) {
  void onOpenCreateModal;
  void Plus;

  return (
    <header className={s.hero}>
      <div className={s.topRow}>
        <div className={s.leftBlock}>
          <span className={s.kicker}>Firma electrónica</span>
        </div>

        {/*
          Botón temporalmente retirado del hero.
          Se conserva la prop onOpenCreateModal para reusarlo después
          en otro header, toolbar o bloque de acciones.
          
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
        */}
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