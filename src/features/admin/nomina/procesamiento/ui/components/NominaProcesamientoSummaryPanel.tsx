import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';

import type { PayrollSummaryDto } from '@/features/admin/nomina/procesamiento/model/procesamiento.types';
import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';
import {
  formatProcesamientoFileTypeLabel,
  formatProcesamientoStageLabel,
  formatProcesamientoStatusLabel,
  getStatusTone,
  getSummaryKpis,
} from '@/features/admin/nomina/procesamiento/model/procesamiento.selectors';

import s from './NominaProcesamientoSummaryPanel.module.css';

type Props = {
  detalle: PayrollSummaryDto;
  archivo: ArchivoNominaDto | null;
};

function getKpiIcon(key: string) {
  switch (key) {
    case 'totalRowsInFile':
      return <FileSpreadsheet size={14} />;
    case 'processedRows':
      return <CheckCircle2 size={14} />;
    case 'errorRows':
      return <AlertTriangle size={14} />;
    default:
      return <FileSpreadsheet size={14} />;
  }
}

function getKpiHint(key: string) {
  switch (key) {
    case 'totalRowsInFile':
      return 'Filas detectadas';
    case 'processedRows':
      return 'Aplicadas';
    case 'errorRows':
      return 'Con incidencia';
    default:
      return '';
  }
}

export default function NominaProcesamientoSummaryPanel({
  detalle,
  archivo,
}: Props) {
  const kpis = getSummaryKpis(detalle);
  const fileStatusTone = getStatusTone(detalle.fileStatus);
  const versionStatusTone = getStatusTone(detalle.versionStatus);
  const displayName = detalle.fileName.replace(/\.dbf$/i, '');

  return (
    <section className={s.panel}>
      <div className={s.kpiGrid}>
        {kpis.map((kpi) => (
          <article
            key={kpi.key}
            className={`${s.kpiCard} ${kpi.tone ? s[`tone_${kpi.tone}`] : ''}`}
          >
            <div className={s.kpiHead}>
              <span className={s.kpiIcon}>{getKpiIcon(kpi.key)}</span>
              <span className={s.kpiLabel}>{kpi.label}</span>
            </div>
            <strong className={s.kpiValue}>{kpi.value}</strong>
            <small className={s.kpiHint}>{getKpiHint(kpi.key)}</small>
          </article>
        ))}
      </div>

      <section className={s.detailPanel}>
        <div className={s.identity}>
          <div className={s.identityTop}>
            {archivo ? <span className={s.idBadge}>#{archivo.fileId}</span> : null}
            <span className={`${s.statusBadge} ${s[fileStatusTone]}`}>
              {formatProcesamientoStatusLabel(detalle.fileStatus)}
            </span>
            <span className={`${s.statusBadge} ${s[versionStatusTone]}`}>
              {formatProcesamientoStatusLabel(detalle.versionStatus)}
            </span>
          </div>

          <div className={s.identityCopy}>
            <strong title={detalle.fileName}>{displayName}</strong>
            <span>
              {detalle.periodCode} - {formatProcesamientoStageLabel(detalle.stage)}
            </span>
          </div>
        </div>

        <dl className={s.metrics}>
          <div className={s.metric}>
            <dt>Tipo</dt>
            <dd>{formatProcesamientoFileTypeLabel(detalle.fileType)}</dd>
          </div>

          <div className={s.metric}>
            <dt>Etapa</dt>
            <dd>{formatProcesamientoStageLabel(detalle.stage)}</dd>
          </div>
        </dl>

        <div className={s.side}>
          <div className={s.sideCard}>
            <div className={s.sideHead}>
              <span className={s.sideIcon}>
                <ShieldCheck size={15} />
              </span>
              <span>Estado del archivo</span>
            </div>
            <strong>{formatProcesamientoStatusLabel(detalle.fileStatus)}</strong>
          </div>
        </div>
      </section>
    </section>
  );
}
