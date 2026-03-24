import { Play, Plus, Search } from 'lucide-react';



import s from './NominaCargaToolbar.module.css';
import { getToolbarPrimaryLabel, getToolbarSearchLabel, getToolbarSearchPlaceholder } from '../utils/nomina-cargas.utils';
import { NominaCargaEntity } from '../types/nomina-cargas.types';

type Props = {
  activeEntity: NominaCargaEntity;
  searchFileId: string;
  loading: boolean;
  canSearch: boolean;
  canExecute: boolean;
  onSearchFileIdChange: (value: string) => void;
  onConsult: () => void;
  onExecute: () => void;
  onPrimaryAction: () => void;
};

export default function NominaCargaToolbar({
  activeEntity,
  searchFileId,
  loading,
  canSearch,
  canExecute,
  onSearchFileIdChange,
  onConsult,
  onExecute,
  onPrimaryAction,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div className={s.searchBlock}>
        <label className={s.searchLabel}>{getToolbarSearchLabel(activeEntity)}</label>

        <div className={s.searchRow}>
          <div className={s.inputWrap}>
            <Search size={16} />
            <input
              type="number"
              min="1"
              value={searchFileId}
              onChange={(e) => onSearchFileIdChange(e.target.value)}
              placeholder={getToolbarSearchPlaceholder(activeEntity)}
            />
          </div>

          <button
            type="button"
            className={s.secondaryBtn}
            disabled={!canSearch || loading}
            onClick={onConsult}
          >
            Consultar
          </button>

          <button
            type="button"
            className={s.ghostBtn}
            disabled={!canExecute || loading}
            onClick={onExecute}
          >
            <Play size={15} />
            Ejecutar
          </button>
        </div>
      </div>

      <button
        type="button"
        className={s.primaryBtn}
        onClick={onPrimaryAction}
        disabled={loading}
      >
        {activeEntity === 'catalogo' ? <Plus size={16} /> : <Play size={16} />}
        {getToolbarPrimaryLabel(activeEntity)}
      </button>
    </section>
  );
}