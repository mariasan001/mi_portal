import { Play, Plus, Search } from 'lucide-react';

import s from './NominaCargaToolbar.module.css';
import {
  getToolbarPrimaryLabel,
  getToolbarSearchLabel,
  getToolbarSearchPlaceholder,
} from '../utils/nomina-cargas.utils';
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
      <div className={s.left}>
        <label className={s.label} htmlFor="nomina-carga-search-id">
          {getToolbarSearchLabel(activeEntity)}
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={17} className={s.icon} />

            <input
              id="nomina-carga-search-id"
              type="number"
              min="1"
              value={searchFileId}
              onChange={(e) => onSearchFileIdChange(e.target.value)}
              placeholder={getToolbarSearchPlaceholder(activeEntity)}
            />
          </div>

          <button
            type="button"
            className={s.searchBtn}
            disabled={!canSearch || loading}
            onClick={onConsult}
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>

          <button
            type="button"
            className={s.executeBtn}
            disabled={!canExecute || loading}
            onClick={onExecute}
          >
            <Play size={16} />
            <span>{loading ? 'Ejecutando...' : 'Ejecutar'}</span>
          </button>
        </div>
      </div>

      <div className={s.right}>
        <button
          type="button"
          className={s.createBtn}
          onClick={onPrimaryAction}
          disabled={loading}
        >
          {activeEntity === 'catalogo' ? <Plus size={17} /> : <Play size={17} />}
          <span>{getToolbarPrimaryLabel(activeEntity)}</span>
        </button>
      </div>
    </section>
  );
}