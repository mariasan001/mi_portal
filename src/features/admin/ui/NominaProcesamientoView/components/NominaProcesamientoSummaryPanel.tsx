'use client';

import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  FolderKanban,
  Hash,
  Layers3,
  ShieldCheck,
} from 'lucide-react';

import s from './NominaProcesamientoSummaryPanel.module.css';
import type { PayrollSummaryDto } from '@/features/admin/types/nomina-procesamiento.types';
import {
  getSummaryFields,
  getSummaryKpis,
  type SummaryField,
} from '../utils/nomina-procesamiento-summary.utils';

type Props = {
  detalle: PayrollSummaryDto;
};

function getFieldIcon(icon: SummaryField['icon']) {
  switch (icon) {
    case 'hash':
      return <Hash size={15} />;
    case 'file':
      return <FileSpreadsheet size={15} />;
    case 'status':
      return <CheckCircle2 size={15} />;
    case 'folder':
      return <FolderKanban size={15} />;
    case 'layers':
      return <Layers3 size={15} />;
    case 'warning':
      return <AlertTriangle size={15} />;
    default:
      return <Hash size={15} />;
  }
}

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

export default function NominaProcesamientoSummaryPanel({ detalle }: Props) {
  const kpis = getSummaryKpis(detalle);
  const fields = getSummaryFields(detalle);

  const fileStatus = fields.find((field) => field.key === 'fileStatus');
  const versionStatus = fields.find((field) => field.key === 'versionStatus');
  const fileName = fields.find((field) => field.key === 'fileName');
  const filePath = fields.find((field) => field.key === 'filePath');
  const fileType = fields.find((field) => field.key === 'fileType');
  const fileId = fields.find((field) => field.key === 'fileId');
  const versionId = fields.find((field) => field.key === 'versionId');
  const stage = fields.find((field) => field.key === 'stage');
  const payPeriodId = fields.find((field) => field.key === 'payPeriodId');
  const periodCode = fields.find((field) => field.key === 'periodCode');

  return (
    <section className={s.panel}>
      <div className={s.kpiGrid}>
        {kpis.map((kpi) => (
          <article
            key={kpi.key}
            className={`${s.kpiCard} ${kpi.tone ? s[`kpi_${kpi.tone}`] : ''}`}
          >
            <div className={s.kpiHead}>
              <div className={`${s.kpiIcon} ${s[`kpiIcon_${kpi.key}`]}`}>
                {getKpiIcon(kpi.key)}
              </div>

              <span className={s.kpiLabel}>{kpi.label}</span>
            </div>

            <div className={s.kpiBody}>
              <strong className={s.kpiValue}>{kpi.value}</strong>
              <small className={s.kpiHint}>{getKpiHint(kpi.key)}</small>
            </div>
          </article>
        ))}
      </div>

      <div className={s.summaryContainer}>
        <div className={s.summaryShell}>
          <div className={s.topGrid}>
            <article className={`${s.infoCard} ${s.heroCard}`}>
              <div className={s.heroHead}>
                <div className={s.heroIconWrap}>
                  <FileSpreadsheet size={18} />
                </div>

                <div className={s.heroCopy}>
                  <span className={s.cardLabel}>Archivo procesado</span>
                  <strong>{periodCode?.value ?? '—'}</strong>
                  <small>Resumen base del procesamiento consultado</small>
                </div>
              </div>
            </article>

            <article className={s.infoCard}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  {getFieldIcon(fileId?.icon ?? 'hash')}
                </div>
                <dt>{fileId?.label ?? 'fileId'}</dt>
              </div>
              <dd>{fileId?.value ?? '—'}</dd>
            </article>

            <article className={s.infoCard}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  {getFieldIcon(fileType?.icon ?? 'file')}
                </div>
                <dt>{fileType?.label ?? 'Tipo'}</dt>
              </div>
              <dd>{fileType?.value ?? '—'}</dd>
            </article>

            <article className={s.infoCard}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <CheckCircle2 size={15} />
                </div>
                <dt>Estatus del archivo</dt>
              </div>
              <dd>
                {fileStatus?.asBadge && fileStatus.tone ? (
                  <span className={`${s.statusBadge} ${s[fileStatus.tone]}`}>
                    {fileStatus.value}
                  </span>
                ) : (
                  fileStatus?.value ?? '—'
                )}
              </dd>
            </article>

            <article className={s.infoCard}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <ShieldCheck size={15} />
                </div>
                <dt>Estatus de versión</dt>
              </div>
              <dd>
                {versionStatus?.asBadge && versionStatus.tone ? (
                  <span className={`${s.statusBadge} ${s[versionStatus.tone]}`}>
                    {versionStatus.value}
                  </span>
                ) : (
                  versionStatus?.value ?? '—'
                )}
              </dd>
            </article>
          </div>

          <div className={s.fileGrid}>
            <article
              className={`${s.fileCard} ${s.fileCardWide} ${s.fileCardName}`}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  {getFieldIcon(fileName?.icon ?? 'folder')}
                </div>
                <dt>{fileName?.label ?? 'Nombre del archivo'}</dt>
              </div>
              <dd className={s.fileValue}>{fileName?.value ?? '—'}</dd>
            </article>

            <article className={`${s.fileCard} ${s.fileCardWide}`}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  {getFieldIcon(filePath?.icon ?? 'folder')}
                </div>
                <dt>{filePath?.label ?? 'Ruta del archivo'}</dt>
              </div>
              <dd className={s.pathValue}>{filePath?.value ?? '—'}</dd>
            </article>
          </div>

          <div className={s.bottomGrid}>
            <article className={s.miniCard}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  {getFieldIcon(versionId?.icon ?? 'layers')}
                </div>
                <dt>{versionId?.label ?? 'versionId'}</dt>
              </div>
              <dd>{versionId?.value ?? '—'}</dd>
            </article>

            <article className={s.miniCard}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  {getFieldIcon(stage?.icon ?? 'layers')}
                </div>
                <dt>{stage?.label ?? 'Etapa'}</dt>
              </div>
              <dd>{stage?.value ?? '—'}</dd>
            </article>

            <article className={s.miniCard}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  {getFieldIcon(payPeriodId?.icon ?? 'hash')}
                </div>
                <dt>{payPeriodId?.label ?? 'payPeriodId'}</dt>
              </div>
              <dd>{payPeriodId?.value ?? '—'}</dd>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}