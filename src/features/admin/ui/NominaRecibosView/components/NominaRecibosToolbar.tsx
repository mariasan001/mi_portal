import s from './NominaRecibosToolbar.module.css';

type Props = {
  versionId: string;
  releasedByUserId: string;
  comments: string;
  onChangeVersionId: (value: string) => void;
  onChangeReleasedByUserId: (value: string) => void;
  onChangeComments: (value: string) => void;
};

export default function NominaRecibosToolbar({
  versionId,
  releasedByUserId,
  comments,
  onChangeVersionId,
  onChangeReleasedByUserId,
  onChangeComments,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div className={s.grid}>
        <label className={s.field}>
          <span>Version ID</span>
          <input
            type="number"
            inputMode="numeric"
            value={versionId}
            onChange={(event) => onChangeVersionId(event.target.value)}
            placeholder="Ej. 125"
          />
        </label>

        <label className={s.field}>
          <span>Released By User ID</span>
          <input
            type="number"
            inputMode="numeric"
            value={releasedByUserId}
            onChange={(event) => onChangeReleasedByUserId(event.target.value)}
            placeholder="Ej. 18"
          />
        </label>
      </div>

      <label className={s.field}>
        <span>Comentarios de liberación</span>
        <textarea
          rows={4}
          value={comments}
          onChange={(event) => onChangeComments(event.target.value)}
          placeholder="Comentario opcional, referencia operativa o motivo de liberación."
        />
      </label>

      <div className={s.helperBox}>
        <strong>Orden recomendado:</strong> primero snapshots, luego recibos y
        después liberación. La sincronización a core opera como una acción
        complementaria del proceso administrativo.
      </div>
    </section>
  );
}