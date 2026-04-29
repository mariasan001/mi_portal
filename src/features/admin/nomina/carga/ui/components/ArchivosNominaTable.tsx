import type { ReactNode } from 'react';
import {
  CalendarDays,
  ChevronDown,
  FileStack,
  HardDrive,
  Play,
} from 'lucide-react';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';

import type { NominaCargaEntity } from '../../model/carga.types';
import {
  formatBytes,
  formatFileTypeLabel,
  formatNominaDateTime,
  formatNominaFileDisplayName,
  formatNominaStatusLabel,
  formatNominaTitle,
  formatPeriodCodeLabel,
  formatVersionDisplayLabel,
  getNominaStatusTone,
} from '../../model/carga.selectors';
import s from './ArchivosNominaTable.module.css';

type Props = {
  emptyState?: ReactNode;
  entity: NominaCargaEntity;
  items: ArchivoNominaDto[];
  loading?: boolean;
  metaText?: string;
  onRun: (fileId: number, fileType?: string) => void;
  onRunGroup?: (items: ArchivoNominaDto[]) => void;
  runLabel: string;
  toolbar?: ReactNode;
};

type NominaFilesGroup = {
  key: string;
  periodCode: string;
  stage: string;
  versionId: number;
  items: ArchivoNominaDto[];
};

function buildStatusClass(status?: string | null) {
  const tone = getNominaStatusTone(status);

  if (tone === 'success') return `${s.statusBadge} ${s.statusSuccess}`;
  if (tone === 'danger') return `${s.statusBadge} ${s.statusDanger}`;
  if (tone === 'info') return `${s.statusBadge} ${s.statusInfo}`;
  return `${s.statusBadge} ${s.statusNeutral}`;
}

function getRunState(status?: string | null, runLabel?: string) {
  switch ((status ?? '').toUpperCase()) {
    case 'PROCESSED':
      return { disabled: true, label: 'Ya procesado' };
    case 'PROCESSING':
      return { disabled: true, label: 'En proceso' };
    default:
      return { disabled: false, label: runLabel ?? 'Ejecutar' };
  }
}

function groupNominaFiles(items: ArchivoNominaDto[]): NominaFilesGroup[] {
  const groups = new Map<string, NominaFilesGroup>();

  for (const item of items) {
    const key = `${item.versionId}-${item.periodCode}-${item.stage}`;
    const current = groups.get(key);

    if (current) {
      current.items.push(item);
      continue;
    }

    groups.set(key, {
      key,
      periodCode: item.periodCode,
      stage: item.stage,
      versionId: item.versionId,
      items: [item],
    });
  }

  return Array.from(groups.values());
}

function renderCatalogRow(
  item: ArchivoNominaDto,
  loading: boolean,
  onRun: (fileId: number, fileType?: string) => void,
  runLabel: string
) {
  const runState = getRunState(item.status, runLabel);
  const displayName = formatNominaFileDisplayName(item.fileName, item.fileType);
  const titleDisplayName = displayName.replace(/\.dbf$/i, '');

  return (
    <article
      key={item.fileId}
      className={`${s.row} ${runState.disabled ? s.rowReadonly : ''}`}
    >
      <div className={s.identity}>
        <div className={s.identityTop}>
          <span className={s.idBadge}>#{item.fileId}</span>
          <span className={buildStatusClass(item.status)}>
            {formatNominaStatusLabel(item.status)}
          </span>
        </div>

        <div className={s.identityCopy}>
          <strong title={item.fileName}>{titleDisplayName}</strong>
          <span>{`${formatPeriodCodeLabel(item.periodCode)} · ${formatNominaTitle(item.stage)}`}</span>
        </div>
      </div>

      <dl className={s.metrics}>
        <div className={s.metric}>
          <dt>Versión asociada</dt>
          <dd>{formatVersionDisplayLabel(item.periodCode, item.versionId)}</dd>
        </div>

        <div className={s.metric}>
          <dt>Tipo</dt>
          <dd>{formatFileTypeLabel(item.fileType)}</dd>
        </div>

        <div className={s.metric}>
          <dt>Tamaño</dt>
          <dd>{formatBytes(item.fileSizeBytes)}</dd>
        </div>

        <div className={s.metric}>
          <dt>Registros</dt>
          <dd>
            {typeof item.rowCount === 'number'
              ? item.rowCount.toLocaleString('es-MX')
              : '—'}
          </dd>
        </div>
      </dl>

      <div className={s.side}>
        <div className={s.timestamps}>
          <div className={s.timeItem}>
            <CalendarDays size={14} />
            <div>
              <span>Carga</span>
              <strong>{formatNominaDateTime(item.uploadedAt)}</strong>
            </div>
          </div>

          <div className={s.timeItem}>
            <HardDrive size={14} />
            <div>
              <span>Procesado</span>
              <strong>{formatNominaDateTime(item.processedAt)}</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={s.runButton}
          onClick={() => onRun(item.fileId, item.fileType)}
          disabled={loading || runState.disabled}
        >
          <Play size={15} />
          <span>{runState.label}</span>
        </button>
      </div>

      <div className={s.footer}>
        <div className={s.fileMeta}>
          <FileStack size={14} />
          <div>
            <span>Archivo fuente</span>
            <strong title={item.filePath}>{displayName}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}

function renderNominaGroup(
  group: NominaFilesGroup,
  loading: boolean,
  onRun: (fileId: number, fileType?: string) => void,
  onRunGroup: ((items: ArchivoNominaDto[]) => void) | undefined,
  runLabel: string
) {
  const processedCount = group.items.filter(
    (item) => (item.status ?? '').toUpperCase() === 'PROCESSED'
  ).length;
  const pendingCount = group.items.filter(
    (item) => !['PROCESSED', 'PROCESSING'].includes((item.status ?? '').toUpperCase())
  ).length;

  return (
    <details key={group.key} className={s.groupCard}>
      <summary className={s.groupSummary}>
        <div className={s.groupIdentity}>
          <strong>{`Versión ${group.periodCode}`}</strong>
          <span>{`${formatPeriodCodeLabel(group.periodCode)} · ${formatNominaTitle(group.stage)}`}</span>
        </div>

        <div className={s.groupMeta}>
          <span className={s.groupMetaItem}>
            {group.items.length} {group.items.length === 1 ? 'archivo' : 'archivos'}
          </span>
          <span className={`${s.summaryBadge} ${s.summaryBadgeSuccess}`}>
            {processedCount} procesados
          </span>
          <span
            className={`${s.summaryBadge} ${
              pendingCount > 0 ? s.summaryBadgeNeutral : s.summaryBadgeMuted
            }`}
          >
            {pendingCount} pendientes
          </span>
          {pendingCount > 0 && onRunGroup ? (
            <button
              type="button"
              className={s.summaryRunButton}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onRunGroup(group.items);
              }}
              disabled={loading}
            >
              <Play size={14} />
              <span>Ejecutar pendientes</span>
            </button>
          ) : null}
          <span className={s.groupChevron} aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </div>
      </summary>

      <div className={s.groupRows}>
        {group.items.map((item) => {
          const runState = getRunState(item.status, runLabel);
          const displayName = formatNominaFileDisplayName(item.fileName, item.fileType);
          const titleDisplayName = displayName.replace(/\.dbf$/i, '');

          return (
            <div key={item.fileId} className={s.groupRow}>
              <div className={s.groupRowMain}>
                <div className={s.groupRowTop}>
                  <span className={s.idBadge}>#{item.fileId}</span>
                  <span className={buildStatusClass(item.status)}>
                    {formatNominaStatusLabel(item.status)}
                  </span>
                </div>

                <div className={s.groupFileCopy}>
                  <strong title={item.fileName}>{titleDisplayName}</strong>
                  <span>{formatFileTypeLabel(item.fileType)}</span>
                </div>
              </div>

              <dl className={s.groupMetrics}>
                <div className={s.groupMetric}>
                  <dt>Tamaño</dt>
                  <dd>{formatBytes(item.fileSizeBytes)}</dd>
                </div>

                <div className={s.groupMetric}>
                  <dt>Registros</dt>
                  <dd>
                    {typeof item.rowCount === 'number'
                      ? item.rowCount.toLocaleString('es-MX')
                      : '—'}
                  </dd>
                </div>

                <div className={s.groupMetric}>
                  <dt>Carga</dt>
                  <dd>{formatNominaDateTime(item.uploadedAt)}</dd>
                </div>

                <div className={s.groupMetric}>
                  <dt>Procesado</dt>
                  <dd>{formatNominaDateTime(item.processedAt)}</dd>
                </div>
              </dl>

              <div className={s.groupActions}>
                <button
                  type="button"
                  className={s.runButton}
                  onClick={() => onRun(item.fileId, item.fileType)}
                  disabled={loading || runState.disabled}
                >
                  <Play size={15} />
                  <span>{runState.label}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </details>
  );
}

export default function ArchivosNominaTable({
  emptyState,
  entity,
  items,
  loading = false,
  metaText,
  onRun,
  onRunGroup,
  runLabel,
  toolbar,
}: Props) {
  const groupedNominaItems = entity === 'nomina' ? groupNominaFiles(items) : [];

  return (
    <section className={s.wrap}>
      <div className={s.header}>
        <h4 className={s.title}>Archivos registrados</h4>
        <span className={s.meta}>{metaText ?? `${items.length} registros`}</span>
      </div>

      {toolbar ? <div className={s.toolbarSlot}>{toolbar}</div> : null}

      {items.length > 0 ? (
        entity === 'catalogo' ? (
          <div className={s.list}>
            {items.map((item) => renderCatalogRow(item, loading, onRun, runLabel))}
          </div>
        ) : (
          <div className={s.groupList}>
            {groupedNominaItems.map((group) =>
              renderNominaGroup(group, loading, onRun, onRunGroup, runLabel)
            )}
          </div>
        )
      ) : (
        emptyState
      )}
    </section>
  );
}
