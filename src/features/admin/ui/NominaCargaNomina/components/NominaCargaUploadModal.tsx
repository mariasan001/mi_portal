'use client';

import { LoaderCircle, X } from 'lucide-react';

import type { NominaFileType } from '../../../types/nomina-catalogo.types';

import s from './NominaCargaUploadModal.module.css';
import { CatalogoModalForm, NominaCargaModalStatus } from '../types/nomina-cargas.types';
import NominaCargaDropzone from './NominaCargaDropzone';

const FILE_TYPE_OPTIONS: NominaFileType[] = [
  'TCOMP',
  'TCALC',
  'HNCOMADI',
  'HNCOMGRA',
  'COMP',
  'CALC',
  'CONTAGUB',
  'CATALOGO',
];

type Props = {
  open: boolean;
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

  const isBusy = loadingUpload || loadingRun || status === 'uploading' || status === 'running';

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <div className={s.head}>
          <div className={s.copy}>
            <span className={s.kicker}>Carga de catálogo</span>
            <h3>Nuevo catálogo de nómina</h3>
            <p>Sube el archivo DBF y ejecuta automáticamente la carga asociada.</p>
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
                onChange={(e) => onFileTypeChange(e.target.value as NominaFileType)}
              >
                {FILE_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className={`${s.field} ${s.fieldWide}`}>
              <span>createdByUserId</span>
              <input
                type="number"
                min="1"
                value={form.createdByUserId}
                onChange={(e) => onFieldChange('createdByUserId', e.target.value)}
                placeholder="Opcional"
              />
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
                {status === 'running' && 'Ejecutando carga'}
                {status === 'success' && 'Proceso completado'}
                {status === 'error' && 'Error en el proceso'}
              </span>
            </div>

            {isBusy ? (
              <div className={s.loaderRow}>
                <LoaderCircle size={16} className={s.loader} />
                <span>
                  {loadingUpload ? 'Subiendo archivo...' : 'Ejecutando carga...'}
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
            {isBusy ? 'Procesando...' : 'Subir y ejecutar'}
          </button>
        </div>
      </div>
    </div>
  );
}