import { ShieldCheck, Search } from 'lucide-react';
import s from './NominaRecibosReleasePanel.module.css';

type Props = {
  versionId: string;
  releasedByUserId: string;
  comments: string;
  loading: boolean;
  canExecute: boolean;
  onChangeVersionId: (value: string) => void;
  onChangeReleasedByUserId: (value: string) => void;
  onChangeComments: (value: string) => void;
  onExecute: () => void;
};

export default function NominaRecibosReleasePanel({
  versionId,
  releasedByUserId,
  comments,
  loading,
  canExecute,
  onChangeVersionId,
  onChangeReleasedByUserId,
  onChangeComments,
  onExecute,
}: Props) {
  return (
    <section className={s.panel}>
      <div className={s.header}>
        <div className={s.headerIcon}>
          <ShieldCheck size={18} />
        </div>

        <div className={s.headerCopy}>
          <span className={s.kicker}>Acción independiente</span>
          <h3>Liberación de versión</h3>
          <p>
            Esta acción puede ejecutarse cuando operación lo decida, sin formar
            parte obligatoria del flujo principal de snapshots, recibos y
            sincronización.
          </p>
        </div>
      </div>

      <div className={s.grid}>
        <div className={s.field}>
          <label className={s.label} htmlFor="nomina-release-version-id">
            Version ID
          </label>

          <div className={s.inputWrap}>
            <Search size={17} className={s.icon} />
            <input
              id="nomina-release-version-id"
              type="number"
              min="1"
              value={versionId}
              onChange={(e) => onChangeVersionId(e.target.value)}
              placeholder="Ej. 125"
            />
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="nomina-released-by-user-id">
            Released By User ID
          </label>

          <div className={s.inputWrap}>
            <ShieldCheck size={17} className={s.icon} />
            <input
              id="nomina-released-by-user-id"
              type="number"
              min="1"
              value={releasedByUserId}
              onChange={(e) => onChangeReleasedByUserId(e.target.value)}
              placeholder="Ej. 18"
            />
          </div>
        </div>

        <div className={`${s.field} ${s.full}`}>
          <label className={s.label} htmlFor="nomina-release-comments">
            Comentarios de liberación
          </label>

          <div className={s.textareaWrap}>
            <textarea
              id="nomina-release-comments"
              rows={4}
              value={comments}
              onChange={(e) => onChangeComments(e.target.value)}
              placeholder="Comentario opcional o referencia operativa."
            />
          </div>
        </div>
      </div>

      <div className={s.actions}>
        <button
          type="button"
          className={s.releaseBtn}
          onClick={onExecute}
          disabled={!canExecute || loading}
        >
          {loading ? 'Liberando...' : 'Liberar versión'}
        </button>
      </div>
    </section>
  );
}