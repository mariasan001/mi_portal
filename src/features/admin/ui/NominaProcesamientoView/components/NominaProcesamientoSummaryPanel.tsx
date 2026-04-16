'use client';

import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  FolderKanban,
  Hash,
  Layers3,
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
      return 'Filas detectadas en el archivo';
    case 'processedRows':
      return 'Aplicadas al procesamiento';
    case 'errorRows':
      return 'Registros con incidencia';
    default:
      return '';
  }
}

export default function NominaProcesamientoSummaryPanel({ detalle }: Props) {
  const kpis = getSummaryKpis(detalle);
  const fields = getSummaryFields(detalle);

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

            <strong className={s.kpiValue}>{kpi.value}</strong>

            <p className={s.kpiHint}>{getKpiHint(kpi.key)}</p>
          </article>
        ))}
      </div>

      <div className={s.detailsBlock}>
        <div className={s.detailsHeader}>
          <span className={s.eyebrow}>Detalle</span>
          <h4>Información del procesamiento</h4>
          <p>
            Resumen del archivo, versión y periodo asociado al procesamiento
            consultado.
          </p>
        </div>

        <dl className={s.grid}>
          {fields.map((field) => (
            <div
              key={field.key}
              className={`${s.item} ${field.wide ? s.itemWide : ''}`}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>{getFieldIcon(field.icon)}</div>
                <dt>{field.label}</dt>
              </div>

              <dd className={field.wide ? s.longValue : undefined}>
                {field.asBadge && field.tone ? (
                  <span className={`${s.statusBadge} ${s[field.tone]}`}>
                    {field.value}
                  </span>
                ) : (
                  field.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
