import { FileSearch } from 'lucide-react';
import s from './EmptyFirmaState.module.css';

export default function EmptyFirmaState() {
  return (
    <section className={s.state}>
      <div className={s.iconWrap}>
        <FileSearch size={22} />
      </div>

      <div className={s.copy}>
        <h3>Selecciona una solicitud</h3>
        <p>
          Da clic en una fila de la tabla para consultar el detalle operativo y
          la evidencia técnica de la firma.
        </p>
      </div>
    </section>
  );
}