'use client';

import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';


import s from './NominaStagingView.module.css';
import { useNominaStaging } from '../../hook/useNominaStaging';

export default function NominaStagingView() {
  const { ejecucion, loadingRun, errorRun, runStaging } = useNominaStaging();

  const [fileId, setFileId] = useState('');

  const canRun = useMemo(() => {
    return Number(fileId) > 0 && !loadingRun;
  }, [fileId, loadingRun]);

  const handleRun = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedFileId = Number(fileId);

    if (!Number.isFinite(parsedFileId) || parsedFileId <= 0) {
      toast.warning('Captura un fileId válido.');
      return;
    }

    try {
      await runStaging(parsedFileId);
      toast.success('Job de staging enviado correctamente.');
    } catch {
      toast.error('No se pudo ejecutar el staging de nómina.');
    }
  };

  return (
    <section className={s.page}>
      <header className={s.hero}>
        <div>
          <p className={s.kicker}>Nómina</p>
          <h1 className={s.title}>Carga de nómina</h1>
          <p className={s.subtitle}>
            Ejecuta el job que procesa un archivo DBF de nómina previamente
            registrado y carga sus filas en staging.
          </p>
        </div>
      </header>

      <article className={s.card}>
        <div className={s.cardHead}>
          <h2>Ejecutar staging de nómina</h2>
          <span className={s.badgeCreate}>POST</span>
        </div>

        <form className={s.form} onSubmit={handleRun}>
          <label className={s.field}>
            <span>fileId</span>
            <input
              type="number"
              min="1"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              placeholder="Ej. 40"
            />
          </label>

          <button className={s.primaryBtn} type="submit" disabled={!canRun}>
            {loadingRun ? 'Ejecutando...' : 'Ejecutar staging'}
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
            <p className={s.empty}>Aún no se ha ejecutado ningún job de staging.</p>
          )}
        </div>
      </article>
    </section>
  );
}