import {  Search, ShieldCheck } from 'lucide-react';
import s from './NominaRecibosToolbar.module.css';
import { NominaRecibosAction } from './NominaRecibosActionCards';

type Props = {
  activeAction: NominaRecibosAction;
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

export default function NominaRecibosToolbar({
  activeAction,
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
  const isLiberacion = activeAction === 'liberacion';

  return (
    <section className={s.toolbar}>
      <div className={s.left}>
        <label className={s.label} htmlFor="nomina-version-id">
          Version ID
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={17} className={s.icon} />

            <input
              id="nomina-version-id"
              type="number"
              min="1"
              value={versionId}
              onChange={(e) => onChangeVersionId(e.target.value)}
              placeholder="Ej. 125"
            />
          </div>

          <button
            type="button"
            className={s.searchBtn}
            onClick={onExecute}
            disabled={!canExecute || loading}
          >
            {loading ? 'Procesando...' : 'Ejecutar'}
          </button>
        </div>
      </div>

      {isLiberacion ? (
        <div className={s.extraFields}>
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
      ) : null}
    </section>
  );
}