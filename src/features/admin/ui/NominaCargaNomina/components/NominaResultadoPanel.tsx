import { Database, FileText, Hash } from 'lucide-react';

import type { EjecucionPayrollStagingDto } from '../../../types/nomina-staging.types';

import s from './NominaResultadoPanel.module.css';

type Props = {
  detalle: EjecucionPayrollStagingDto;
};

export default function NominaResultadoPanel({ detalle }: Props) {
  return (
    <section className={s.panel}>
      <div className={s.intro}>
        <div className={s.introBadge}>
          <Database size={14} />
          Resultado de nómina
        </div>

        <div className={s.introCopy}>
          <h4>Detalle del staging ejecutado</h4>
          <p>Revisa la información principal del job de nómina más reciente.</p>
        </div>
      </div>

      <dl className={s.grid}>
        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>executionId</dt>
          </div>
          <dd>{detalle.executionId}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>fileId</dt>
          </div>
          <dd>{detalle.fileId}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FileText size={15} />
            </div>
            <dt>jobName</dt>
          </div>
          <dd>{detalle.jobName}</dd>
        </div>
      </dl>
    </section>
  );
}