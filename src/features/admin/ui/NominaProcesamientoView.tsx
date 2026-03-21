'use client';

import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';


import s from './NominaProcesamientoView.module.css';
import { useNominaProcesamiento } from '../hook/useNominaProcesamiento';

export default function NominaProcesamientoView() {
  const {
    summary,
    previewRows,
    errorRows,
    loadingSummary,
    loadingPreview,
    loadingErrors,
    errorSummary,
    errorPreview,
    errorErrors,
    consultarSummary,
    consultarPreview,
    consultarErrors,
  } = useNominaProcesamiento();

  const [summaryFileId, setSummaryFileId] = useState('');
  const [previewFileId, setPreviewFileId] = useState('');
  const [previewLimit, setPreviewLimit] = useState('20');
  const [errorsFileId, setErrorsFileId] = useState('');
  const [errorsLimit, setErrorsLimit] = useState('50');

  const canSummary = useMemo(
    () => Number(summaryFileId) > 0 && !loadingSummary,
    [summaryFileId, loadingSummary]
  );

  const canPreview = useMemo(
    () =>
      Number(previewFileId) > 0 &&
      Number(previewLimit) > 0 &&
      !loadingPreview,
    [previewFileId, previewLimit, loadingPreview]
  );

  const canErrors = useMemo(
    () =>
      Number(errorsFileId) > 0 &&
      Number(errorsLimit) > 0 &&
      !loadingErrors,
    [errorsFileId, errorsLimit, loadingErrors]
  );

  const handleSummary = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileId = Number(summaryFileId);

    if (!Number.isFinite(fileId) || fileId <= 0) {
      toast.warning('Captura un fileId válido para resumen.');
      return;
    }

    try {
      await consultarSummary(fileId);
      toast.success('Resumen consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el resumen.');
    }
  };

  const handlePreview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileId = Number(previewFileId);
    const limit = Number(previewLimit);

    if (!Number.isFinite(fileId) || fileId <= 0) {
      toast.warning('Captura un fileId válido para preview.');
      return;
    }

    if (!Number.isFinite(limit) || limit <= 0) {
      toast.warning('Captura un límite válido para preview.');
      return;
    }

    try {
      await consultarPreview(fileId, limit);
      toast.success('Preview consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el preview.');
    }
  };

  const handleErrors = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileId = Number(errorsFileId);
    const limit = Number(errorsLimit);

    if (!Number.isFinite(fileId) || fileId <= 0) {
      toast.warning('Captura un fileId válido para errores.');
      return;
    }

    if (!Number.isFinite(limit) || limit <= 0) {
      toast.warning('Captura un límite válido para errores.');
      return;
    }

    try {
      await consultarErrors(fileId, limit);
      toast.success('Errores consultados correctamente.');
    } catch {
      toast.error('No se pudo consultar el detalle de errores.');
    }
  };

  return (
    <section className={s.page}>
      <header className={s.hero}>
        <div>
          <p className={s.kicker}>Nómina</p>
          <h1 className={s.title}>Revisión del procesamiento</h1>
          <p className={s.subtitle}>
            Consulta el resumen del staging, una muestra de filas procesadas y
            el detalle de filas con error por archivo.
          </p>
        </div>
      </header>

      <div className={s.stack}>
        <article className={s.card}>
          <div className={s.cardHead}>
            <h2>Resumen de staging</h2>
            <span className={s.badge}>GET</span>
          </div>

          <form className={s.inlineForm} onSubmit={handleSummary}>
            <label className={s.field}>
              <span>fileId</span>
              <input
                type="number"
                min="1"
                value={summaryFileId}
                onChange={(e) => setSummaryFileId(e.target.value)}
                placeholder="Ej. 40"
              />
            </label>

            <button className={s.primaryBtn} type="submit" disabled={!canSummary}>
              {loadingSummary ? 'Consultando...' : 'Consultar resumen'}
            </button>
          </form>

          {errorSummary ? <p className={s.error}>{errorSummary}</p> : null}

          <div className={s.resultBlock}>
            <h3>Resultado</h3>

            {summary ? (
              <dl className={s.detailGrid}>
                <div><dt>fileId</dt><dd>{summary.fileId}</dd></div>
                <div><dt>fileType</dt><dd>{summary.fileType}</dd></div>
                <div><dt>fileStatus</dt><dd>{summary.fileStatus}</dd></div>
                <div><dt>fileName</dt><dd>{summary.fileName}</dd></div>
                <div><dt>filePath</dt><dd>{summary.filePath}</dd></div>
                <div><dt>versionId</dt><dd>{summary.versionId}</dd></div>
                <div><dt>stage</dt><dd>{summary.stage}</dd></div>
                <div><dt>versionStatus</dt><dd>{summary.versionStatus}</dd></div>
                <div><dt>payPeriodId</dt><dd>{summary.payPeriodId}</dd></div>
                <div><dt>periodCode</dt><dd>{summary.periodCode}</dd></div>
                <div><dt>Total filas</dt><dd>{summary.totalRowsInFile}</dd></div>
                <div><dt>Procesadas</dt><dd>{summary.processedRows}</dd></div>
                <div><dt>Con error</dt><dd>{summary.errorRows}</dd></div>
              </dl>
            ) : (
              <p className={s.empty}>Aún no has consultado ningún resumen.</p>
            )}
          </div>
        </article>

        <article className={s.card}>
          <div className={s.cardHead}>
            <h2>Preview de staging</h2>
            <span className={s.badge}>GET</span>
          </div>

          <form className={s.inlineForm2} onSubmit={handlePreview}>
            <label className={s.field}>
              <span>fileId</span>
              <input
                type="number"
                min="1"
                value={previewFileId}
                onChange={(e) => setPreviewFileId(e.target.value)}
                placeholder="Ej. 40"
              />
            </label>

            <label className={s.field}>
              <span>limit</span>
              <input
                type="number"
                min="1"
                value={previewLimit}
                onChange={(e) => setPreviewLimit(e.target.value)}
                placeholder="20"
              />
            </label>

            <button className={s.primaryBtn} type="submit" disabled={!canPreview}>
              {loadingPreview ? 'Consultando...' : 'Consultar preview'}
            </button>
          </form>

          {errorPreview ? <p className={s.error}>{errorPreview}</p> : null}

          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>rowNum</th>
                  <th>fileType</th>
                  <th>payPeriodCode</th>
                  <th>receiptPeriodCode</th>
                  <th>neyemp</th>
                  <th>neyrfc</th>
                  <th>negnom</th>
                  <th>necpza</th>
                  <th>nominaTipo</th>
                  <th>loadStatus</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.length ? (
                  previewRows.map((row) => (
                    <tr key={`${row.fileId}-${row.rowNum}`}>
                      <td>{row.rowNum}</td>
                      <td>{row.fileType}</td>
                      <td>{row.payPeriodCode}</td>
                      <td>{row.receiptPeriodCode}</td>
                      <td>{row.neyemp}</td>
                      <td>{row.neyrfc}</td>
                      <td>{row.negnom}</td>
                      <td>{row.necpza}</td>
                      <td>{row.nominaTipo}</td>
                      <td>{row.loadStatus}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className={s.emptyCell}>
                      Aún no hay preview cargado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className={s.card}>
          <div className={s.cardHead}>
            <h2>Filas con error</h2>
            <span className={s.badge}>GET</span>
          </div>

          <form className={s.inlineForm2} onSubmit={handleErrors}>
            <label className={s.field}>
              <span>fileId</span>
              <input
                type="number"
                min="1"
                value={errorsFileId}
                onChange={(e) => setErrorsFileId(e.target.value)}
                placeholder="Ej. 40"
              />
            </label>

            <label className={s.field}>
              <span>limit</span>
              <input
                type="number"
                min="1"
                value={errorsLimit}
                onChange={(e) => setErrorsLimit(e.target.value)}
                placeholder="50"
              />
            </label>

            <button className={s.primaryBtn} type="submit" disabled={!canErrors}>
              {loadingErrors ? 'Consultando...' : 'Consultar errores'}
            </button>
          </form>

          {errorErrors ? <p className={s.error}>{errorErrors}</p> : null}

          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>rowNum</th>
                  <th>fileType</th>
                  <th>payPeriodCode</th>
                  <th>receiptPeriodCode</th>
                  <th>neyemp</th>
                  <th>necpza</th>
                  <th>nominaTipo</th>
                  <th>isReexpedition</th>
                  <th>errorDetail</th>
                </tr>
              </thead>
              <tbody>
                {errorRows.length ? (
                  errorRows.map((row) => (
                    <tr key={`${row.fileId}-${row.rowNum}`}>
                      <td>{row.rowNum}</td>
                      <td>{row.fileType}</td>
                      <td>{row.payPeriodCode}</td>
                      <td>{row.receiptPeriodCode}</td>
                      <td>{row.neyemp}</td>
                      <td>{row.necpza}</td>
                      <td>{row.nominaTipo}</td>
                      <td>{row.isReexpedition ? 'Sí' : 'No'}</td>
                      <td>{row.errorDetail}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className={s.emptyCell}>
                      Aún no hay errores cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}