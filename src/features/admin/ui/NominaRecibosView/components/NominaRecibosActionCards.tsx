import {
  FileStack,
  ReceiptText,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import s from './NominaRecibosActionCards.module.css';

export type NominaRecibosAction =
  | 'snapshots'
  | 'recibos'
  | 'liberacion'
  | 'sincronizacion';

type Props = {
  activeAction: NominaRecibosAction;
  onSelect: (action: NominaRecibosAction) => void;
};

export default function NominaRecibosActionCards({
  activeAction,
  onSelect,
}: Props) {
  return (
    <section className={s.grid}>
      <button
        type="button"
        className={`${s.card} ${
          activeAction === 'snapshots' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('snapshots')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <FileStack size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Snapshots</h2>
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

      <button
        type="button"
        className={`${s.card} ${
          activeAction === 'liberacion' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('liberacion')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Liberación</h2>
            {activeAction === 'liberacion' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Libera la versión procesada y actualiza el estado operativo
            correspondiente.
          </p>
        </div>
      </button>

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