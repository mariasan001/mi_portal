import { Search } from 'lucide-react';
import type { NominaRecibosAction } from '../types/nomina-recibos-view.types';
import s from './NominaRecibosToolbar.module.css';

type Props = {
  activeAction: NominaRecibosAction;
  versionId: string;
  loading: boolean;
  canExecute: boolean;
  onChangeVersionId: (value: string) => void;
  onExecute: () => void;
};

export default function NominaRecibosToolbar({
  activeAction,
  versionId,
  loading,
  canExecute,
  onChangeVersionId,
  onExecute,
}: Props) {
  const getButtonLabel = (): string => {
    switch (activeAction) {
      case 'snapshots':
        return loading ? 'Generando...' : 'Generar snapshots';
      case 'recibos':
        return loading ? 'Generando...' : 'Generar recibos';
      case 'sincronizacion':
        return loading ? 'Sincronizando...' : 'Ejecutar sincronización';
      default:
        return loading ? 'Procesando...' : 'Ejecutar';
    }
  };

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
            {getButtonLabel()}
          </button>
        </div>
      </div>
    </section>
  );
}