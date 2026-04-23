

import { LoaderCircle, X } from 'lucide-react';

import type { NominaFileType } from '../../../types/nomina-catalogo.types';

import s from './NominaCargaUploadModal.module.css';
import {
  CatalogoModalForm,
  NominaCargaEntity,
  NominaCargaModalStatus,
} from '../types/nomina-cargas.types';
import NominaCargaDropzone from './NominaCargaDropzone';

const FILE_TYPE_OPTIONS_CATALOGO: NominaFileType[] = ['CATALOGO'];

const FILE_TYPE_OPTIONS_NOMINA: NominaFileType[] = [
  'TCOMP',
  'TCALC',
  'HNCOMADI',
  'HNCOMGRA',
  'COMP',
  'CALC',
  'CONTAGUB',
];

type Props = {
  open: boolean;
  entity: NominaCargaEntity;
  form: CatalogoModalForm;
  status: NominaCargaModalStatus;
  error: string | null;
  loadingUpload: boolean;
  loadingRun: boolean;
  onClose: () => void;
  onFieldChange: <K extends keyof CatalogoModalForm>(
    key: K,
    value: CatalogoModalForm[K]
  ) => void;
  onFileTypeChange: (value: NominaFileType) => void;
  onSubmit: () => void;
};

export default function NominaCargaUploadModal({
  open,
  entity,
  form,
  status,
  error,
  loadingUpload,
  loadingRun,
  onClose,
  onFieldChange,
  onFileTypeChange,
  onSubmit,
}: Props) {
  if (!open) return null;

  const isCatalogo = entity === 'catalogo';

  const availableOptions = isCatalogo
    ? FILE_TYPE_OPTIONS_CATALOGO
    : FILE_TYPE_OPTIONS_NOMINA;

  const isBusy =
    loadingUpload ||
    loadingRun ||
    status === 'uploading' ||
    status === 'running';

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <div className={s.head}>
          <div className={s.copy}>
            <span className={s.kicker}>
              {isCatalogo ? 'Carga de catálogo' : 'Carga de nómina'}
            </span>

            <h3>
              {isCatalogo
                ? 'Nuevo catálogo de nómina'
                : 'Nuevo archivo de nómina'}
            </h3>

            <p>
              {isCatalogo
                ? 'Sube el archivo DBF y ejecuta automáticamente la carga asociada.'
                : 'Sube el archivo DBF y ejecuta automáticamente el staging asociado.'}
            </p>
          </div>

          <button
            type="button"
            className={s.closeBtn}
            onClick={onClose}
            disabled={isBusy}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className={s.body}>
          <div className={s.grid}>
            <label className={s.field}>
              <span>versionId</span>
              <input
                type="number"
                min="1"
                value={form.versionId}
                onChange={(e) => onFieldChange('versionId', e.target.value)}
                placeholder="Ej. 10"
              />
            </label>

            <label className={s.field}>
              <span>fileType</span>
              <select
                value={form.fileType}
                onChange={(e) =>
                  onFileTypeChange(e.target.value as NominaFileType)
                }
              >
                {availableOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <NominaCargaDropzone
            file={form.file}
            onSelectFile={(file) => onFieldChange('file', file)}
          />

          <div className={s.statusBlock}>
            <div className={s.statusLine}>
              <span className={s.statusLabel}>Estado</span>
              <span className={s.statusValue}>
                {status === 'idle' && 'Esperando archivo'}
                {status === 'selected' && 'Archivo listo'}
                {status === 'uploading' && 'Subiendo archivo'}
                {status === 'running' &&
                  (isCatalogo ? 'Ejecutando catálogo' : 'Ejecutando staging')}
                {status === 'success' && 'Proceso completado'}
                {status === 'error' && 'Error en el proceso'}
              </span>
            </div>

            {isBusy ? (
              <div className={s.loaderRow}>
                <LoaderCircle size={16} className={s.loader} />
                <span>
                  {loadingUpload
                    ? 'Subiendo archivo...'
                    : isCatalogo
                    ? 'Ejecutando catálogo...'
                    : 'Ejecutando staging...'}
                </span>
              </div>
            ) : null}

            {error ? <p className={s.error}>{error}</p> : null}
          </div>
        </div>

        <div className={s.actions}>
          <button
            type="button"
            className={s.secondaryBtn}
            onClick={onClose}
            disabled={isBusy}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={s.primaryBtn}
            onClick={onSubmit}
            disabled={isBusy}
          >
            {isBusy
              ? 'Procesando...'
              : isCatalogo
              ? 'Subir y ejecutar'
              : 'Subir y ejecutar'}
          </button>
        </div>
      </div>
    </div>
  );
}