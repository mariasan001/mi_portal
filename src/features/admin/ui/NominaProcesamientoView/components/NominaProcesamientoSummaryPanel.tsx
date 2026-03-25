import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  FolderKanban,
  Hash,
  Layers3,
} from 'lucide-react';

import s from './NominaProcesamientoSummaryPanel.module.css';
import { PayrollSummaryDto } from '@/features/admin/types/nomina-procesamiento.types';

type Props = {
  detalle: PayrollSummaryDto;
};

function getStatusTone(value: string) {
  const normalized = value.trim().toLowerCase();

  if (
    normalized.includes('ok') ||
    normalized.includes('success') ||
    normalized.includes('complet') ||
    normalized.includes('proces')
  ) {
    return 'ok';
  }

  if (
    normalized.includes('pend') ||
    normalized.includes('progress') ||
    normalized.includes('partial') ||
    normalized.includes('valid')
  ) {
    return 'warn';
  }

  if (
    normalized.includes('error') ||
    normalized.includes('fail') ||
    normalized.includes('rechaz')
  ) {
    return 'danger';
  }

  return 'neutral';
}

function getErrorTone(errorRows: number, processedRows: number) {
  if (errorRows === 0) return 'ok';
  if (processedRows > 0) return 'warn';
  return 'danger';
}

export default function NominaProcesamientoSummaryPanel({ detalle }: Props) {
  const fileStatusTone = getStatusTone(detalle.fileStatus);
  const versionStatusTone = getStatusTone(detalle.versionStatus);
  const errorTone = getErrorTone(detalle.errorRows, detalle.processedRows);

  return (
    <section className={s.panel}>
      <div className={s.kpiGrid}>
        <div className={s.kpiCard}>
          <span>Total filas</span>
          <strong>{detalle.totalRowsInFile}</strong>
        </div>

        <div className={s.kpiCard}>
          <span>Procesadas</span>
          <strong>{detalle.processedRows}</strong>
        </div>

        <div className={`${s.kpiCard} ${s[errorTone]}`}>
          <span>Con error</span>
          <strong>{detalle.errorRows}</strong>
        </div>
      </div>

      <dl className={s.grid}>
        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>fileId</dt>
          </div>
          <dd>{detalle.fileId}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FileSpreadsheet size={15} />
            </div>
            <dt>Tipo de archivo</dt>
          </div>
          <dd>{detalle.fileType}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CheckCircle2 size={15} />
            </div>
            <dt>Estatus del archivo</dt>
          </div>
          <dd>
            <span className={`${s.statusBadge} ${s[fileStatusTone]}`}>
              {detalle.fileStatus}
            </span>
          </dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FolderKanban size={15} />
            </div>
            <dt>Nombre del archivo</dt>
          </div>
          <dd>{detalle.fileName}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FolderKanban size={15} />
            </div>
            <dt>Ruta del archivo</dt>
          </div>
          <dd>{detalle.filePath}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Layers3 size={15} />
            </div>
            <dt>versionId</dt>
          </div>
          <dd>{detalle.versionId}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Layers3 size={15} />
            </div>
            <dt>Etapa</dt>
          </div>
          <dd>{detalle.stage}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <AlertTriangle size={15} />
            </div>
            <dt>Estatus de versión</dt>
          </div>
          <dd>
            <span className={`${s.statusBadge} ${s[versionStatusTone]}`}>
              {detalle.versionStatus}
            </span>
          </dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>payPeriodId</dt>
          </div>
          <dd>{detalle.payPeriodId}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>periodCode</dt>
          </div>
          <dd>{detalle.periodCode}</dd>
        </div>
      </dl>
    </section>
  );
}