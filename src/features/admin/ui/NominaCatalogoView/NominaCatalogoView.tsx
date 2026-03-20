'use client';

import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { NominaFileType } from '../../types/nomina-catalogo.types';

import s from './NominaCatalogoView.module.css';
import { useNominaCatalogo } from '../../hook/useNominaCatalogo';

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

function formatFechaHora(value: string) {
  if (!value) return '—';
  return value;
}

export default function NominaCatalogoView() {
  const {
    archivo,
    ejecucion,
    loadingUpload,
    loadingRun,
    errorUpload,
    errorRun,
    uploadArchivo,
    runCatalogo,
  } = useNominaCatalogo();

  const [versionId, setVersionId] = useState('');
  const [fileType, setFileType] = useState<NominaFileType>('TCOMP');
  const [createdByUserId, setCreatedByUserId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [fileIdToRun, setFileIdToRun] = useState('');

  const canUpload = useMemo(() => {
    return (
      Number(versionId) > 0 &&
      fileType.trim().length > 0 &&
      selectedFile instanceof File &&
      !loadingUpload
    );
  }, [versionId, fileType, selectedFile, loadingUpload]);

  const canRun = useMemo(() => {
    return Number(fileIdToRun) > 0 && !loadingRun;
  }, [fileIdToRun, loadingRun]);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedVersionId = Number(versionId);
    const parsedCreatedByUserId =
      createdByUserId.trim().length > 0 ? Number(createdByUserId) : undefined;

    if (!Number.isFinite(parsedVersionId) || parsedVersionId <= 0) {
      toast.warning('Captura un versionId válido.');
      return;
    }

    if (!(selectedFile instanceof File)) {
      toast.warning('Selecciona un archivo DBF.');
      return;
    }

    if (
      parsedCreatedByUserId !== undefined &&
      (!Number.isFinite(parsedCreatedByUserId) || parsedCreatedByUserId <= 0)
    ) {
      toast.warning('createdByUserId debe ser válido.');
      return;
    }

    try {
      await uploadArchivo({
        versionId: parsedVersionId,
        fileType,
        createdByUserId: parsedCreatedByUserId,
        file: selectedFile,
      });

      toast.success('Archivo cargado correctamente.');
    } catch {
      toast.error('No se pudo cargar el archivo.');
    }
  };

  const handleRun = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedFileId = Number(fileIdToRun);

    if (!Number.isFinite(parsedFileId) || parsedFileId <= 0) {
      toast.warning('Captura un fileId válido.');
      return;
    }

    try {
      await runCatalogo(parsedFileId);
      toast.success('Job enviado correctamente.');
    } catch {
      toast.error('No se pudo ejecutar la carga de catálogo.');
    }
  };

  return (
    <section className={s.page}>
      <header className={s.hero}>
        <div>
          <p className={s.kicker}>Nómina</p>
          <h1 className={s.title}>Carga de catálogo</h1>
          <p className={s.subtitle}>
            Sube archivos DBF ligados a una versión de nómina y ejecuta el batch
            de catálogo a partir del archivo registrado.
          </p>
        </div>
      </header>

      <div className={s.grid}>
        <article className={s.card}>
          <div className={s.cardHead}>
            <h2>Upload de archivo</h2>
            <span className={s.badgeCreate}>POST</span>
          </div>

          <form className={s.form} onSubmit={handleUpload}>
            <label className={s.field}>
              <span>versionId</span>
              <input
                type="number"
                min="1"
                value={versionId}
                onChange={(e) => setVersionId(e.target.value)}
                placeholder="Ej. 10"
              />
            </label>

            <label className={s.field}>
              <span>fileType</span>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as NominaFileType)}
              >
                {FILE_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className={s.field}>
              <span>createdByUserId</span>
              <input
                type="number"
                min="1"
                value={createdByUserId}
                onChange={(e) => setCreatedByUserId(e.target.value)}
                placeholder="Opcional"
              />
            </label>

            <label className={s.field}>
              <span>Archivo DBF</span>
              <input
                type="file"
                accept=".dbf"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedFile(file);
                }}
              />
            </label>

            <button className={s.successBtn} type="submit" disabled={!canUpload}>
              {loadingUpload ? 'Subiendo...' : 'Subir archivo'}
            </button>
          </form>

          {errorUpload ? <p className={s.error}>{errorUpload}</p> : null}

          <div className={s.resultBlock}>
            <h3>Archivo registrado</h3>

            {archivo ? (
              <dl className={s.detailGrid}>
                <div>
                  <dt>fileId</dt>
                  <dd>{archivo.fileId}</dd>
                </div>
                <div>
                  <dt>versionId</dt>
                  <dd>{archivo.versionId}</dd>
                </div>
                <div>
                  <dt>Tipo</dt>
                  <dd>{archivo.fileType}</dd>
                </div>
                <div>
                  <dt>Nombre</dt>
                  <dd>{archivo.fileName}</dd>
                </div>
                <div>
                  <dt>Ruta</dt>
                  <dd>{archivo.filePath}</dd>
                </div>
                <div>
                  <dt>Checksum</dt>
                  <dd>{archivo.checksumSha256}</dd>
                </div>
                <div>
                  <dt>Tamaño</dt>
                  <dd>{archivo.fileSizeBytes}</dd>
                </div>
                <div>
                  <dt>Estatus</dt>
                  <dd>{archivo.status}</dd>
                </div>
                <div>
                  <dt>Subido en</dt>
                  <dd>{formatFechaHora(archivo.uploadedAt)}</dd>
                </div>
              </dl>
            ) : (
              <p className={s.empty}>Todavía no has subido ningún archivo.</p>
            )}
          </div>
        </article>

        <article className={s.card}>
          <div className={s.cardHead}>
            <h2>Ejecutar carga de catálogo</h2>
            <span className={s.badgeCreate}>POST</span>
          </div>

          <form className={s.form} onSubmit={handleRun}>
            <label className={s.field}>
              <span>fileId</span>
              <input
                type="number"
                min="1"
                value={fileIdToRun}
                onChange={(e) => setFileIdToRun(e.target.value)}
                placeholder="Ej. 25"
              />
            </label>

            <button className={s.primaryBtn} type="submit" disabled={!canRun}>
              {loadingRun ? 'Ejecutando...' : 'Ejecutar carga'}
            </button>
          </form>

          {errorRun ? <p className={s.error}>{errorRun}</p> : null}

          <div className={s.resultBlock}>
            <h3>Resultado del job</h3>

            {ejecucion ? (
              <dl className={s.detailGrid}>
                <div>
                  <dt>executionId</dt>
                  <dd>{ejecucion.executionId}</dd>
                </div>
                <div>
                  <dt>fileId</dt>
                  <dd>{ejecucion.fileId}</dd>
                </div>
                <div>
                  <dt>jobName</dt>
                  <dd>{ejecucion.jobName}</dd>
                </div>
              </dl>
            ) : (
              <p className={s.empty}>Aún no se ha ejecutado ningún job.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}