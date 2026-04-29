import { X } from 'lucide-react';

import type { NominaFileType } from '@/features/admin/nomina/shared/model/catalogo.types';
import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';
import type {
  CatalogoModalForm,
  NominaCargaEntity,
  NominaCargaModalStatus,
} from '../../model/carga.types';
import { formatNominaTitle } from '../../model/carga.selectors';
import NominaCargaDropzone from './NominaCargaDropzone';
import s from './NominaCargaUploadModal.module.css';

const FILE_TYPE_OPTIONS_CATALOGO: NominaFileType[] = ['CATALOGO'];

type Props = {
  open: boolean;
  entity: NominaCargaEntity;
  form: CatalogoModalForm;
  status: NominaCargaModalStatus;
  error: string | null;
  loadingUpload: boolean;
  loadingRun: boolean;
  loadingVersiones: boolean;
  submitIntent: 'upload' | 'uploadAndRun' | null;
  versiones: VersionNominaDto[];
  onClose: () => void;
  onFieldChange: <K extends keyof CatalogoModalForm>(
    key: K,
    value: CatalogoModalForm[K]
  ) => void;
  onFileTypeChange: (value: NominaFileType) => void;
  onUploadOnly: () => void;
  onUploadAndRun: () => void;
};

function formatVersionOptionLabel(version: VersionNominaDto) {
  return `${version.periodCode} · ${formatNominaTitle(version.stage)}`;
}

export default function NominaCargaUploadModal({
  open,
  entity,
  form,
  status,
  error,
  loadingUpload,
  loadingRun,
  loadingVersiones,
  submitIntent,
  versiones,
  onClose,
  onFieldChange,
  onFileTypeChange,
  onUploadOnly,
  onUploadAndRun,
}: Props) {
  if (!open) return null;

  const isCatalogo = entity === 'catalogo';
  const isBusy =
    loadingUpload ||
    loadingRun ||
    status === 'uploading' ||
    status === 'running' ||
    submitIntent !== null;

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <div className={s.head}>
          <div className={s.copy}>
            <span className={s.kicker}>
              {isCatalogo ? 'Carga de catálogo' : 'Carga de nómina'}
            </span>

            <h3>{isCatalogo ? 'Nuevo catálogo de nómina' : 'Nuevos archivos de nómina'}</h3>

            <p>
              {isCatalogo
                ? 'Selecciona la versión y decide si solo quieres subir el archivo o subirlo y ejecutarlo.'
                : 'Selecciona la versión y carga uno o varios DBF. Puedes solo subirlos o subirlos y ejecutarlos en cola.'}
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
          <section className={s.section}>
            <div className={s.sectionHead}>
              <h4>Identificación</h4>
              <p>{isCatalogo ? 'Elige la versión y el tipo de archivo.' : 'Elige la versión de trabajo.'}</p>
            </div>

            <div className={s.grid}>
              <label className={`${s.field} ${!isCatalogo ? s.fieldWide : ''}`}>
                <span>Versión</span>
                <select
                  value={form.versionId}
                  onChange={(event) => onFieldChange('versionId', event.target.value)}
                  disabled={loadingVersiones || isBusy}
                >
                  <option value="">
                    {loadingVersiones ? 'Cargando versiones...' : 'Selecciona una versión'}
                  </option>
                  {versiones.map((version) => (
                    <option key={version.versionId} value={String(version.versionId)}>
                      {formatVersionOptionLabel(version)}
                    </option>
                  ))}
                </select>
                <small>{isCatalogo ? 'Selecciona una versión existente.' : 'Base de la cola.'}</small>
              </label>

              {isCatalogo ? (
                <label className={s.field}>
                  <span>Tipo de archivo</span>
                  <select
                    value={form.fileType}
                    onChange={(event) =>
                      onFileTypeChange(event.target.value as NominaFileType)
                    }
                    disabled={isBusy}
                  >
                    {FILE_TYPE_OPTIONS_CATALOGO.map((option) => (
                      <option key={option} value={option}>
                        {formatNominaTitle(option)}
                      </option>
                    ))}
                  </select>
                  <small>Solo se permite un catálogo por versión.</small>
                </label>
              ) : null}
            </div>
          </section>

          <section className={s.section}>
            <div className={s.sectionHead}>
              <h4>Archivo</h4>
              <p>
                {isCatalogo
                  ? 'Selecciona el DBF que se cargará en este flujo.'
                  : 'Selecciona uno o varios DBF para iniciar la cola.'}
              </p>
            </div>

            <NominaCargaDropzone
              files={form.files}
              multiple={!isCatalogo}
              onSelectFiles={(files) => onFieldChange('files', files)}
            />

            {!isCatalogo ? (
              <p className={s.helperNote}>
                El tipo de cada archivo se detectará automáticamente por su nombre.
              </p>
            ) : null}
          </section>

          {error ? <p className={s.error}>{error}</p> : null}
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
            className={s.tertiaryBtn}
            onClick={onUploadOnly}
            disabled={isBusy}
          >
            {submitIntent === 'upload' ? 'Subiendo...' : 'Subir'}
          </button>

          <button
            type="button"
            className={s.primaryBtn}
            onClick={onUploadAndRun}
            disabled={isBusy}
          >
            {submitIntent === 'uploadAndRun' ? 'Procesando...' : 'Subir y ejecutar'}
          </button>
        </div>
      </div>
    </div>
  );
}
