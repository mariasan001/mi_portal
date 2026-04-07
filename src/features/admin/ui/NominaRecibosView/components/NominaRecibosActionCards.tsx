import { FileStack, ReceiptText, RefreshCw } from 'lucide-react';
import type { NominaRecibosAction } from '../types/nomina-recibos-view.types';
import s from './NominaRecibosActionCards.module.css';

type Props = {
  // Acción actualmente seleccionada dentro del flujo principal
  activeAction: NominaRecibosAction;

  // Callback para cambiar la acción activa
  onSelect: (action: NominaRecibosAction) => void;
};

export default function NominaRecibosActionCards({
  activeAction,
  onSelect,
}: Props) {
  return (
    // Contenedor general de las 3 tarjetas del flujo principal
    <section className={s.grid}>
      {/* Card: Snapshots */}
      <button
        type="button"
        className={`${s.card} ${
          activeAction === 'snapshots' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('snapshots')}
      >
        {/* Ícono principal de la tarjeta */}
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <FileStack size={20} />
          </div>
        </div>

        {/* Contenido textual */}
        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Snapshots</h2>

            {/* Badge visible solo si esta acción está seleccionada */}
            {activeAction === 'snapshots' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Genera snapshots consolidados desde staging para la versión
            seleccionada.
          </p>
        </div>
      </button>

      {/* Card: Recibos */}
      <button
        type="button"
        className={`${s.card} ${
          activeAction === 'recibos' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('recibos')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <ReceiptText size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Recibos</h2>

            {activeAction === 'recibos' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Construye recibos y su detalle asociado a partir de snapshots
            previamente generados.
          </p>
        </div>
      </button>

      {/* Card: Sincronización */}
      <button
        type="button"
        className={`${s.card} ${
          activeAction === 'sincronizacion' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('sincronizacion')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <RefreshCw size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Sincronización</h2>

            {activeAction === 'sincronizacion' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Ejecuta la sincronización complementaria a core para la versión
            vigente.
          </p>
        </div>
      </button>
    </section>
  );
}