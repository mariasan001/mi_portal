import type { ReactNode } from 'react';

import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';
import {
  formatNominaDate,
  formatNominaStatusLabel,
  formatNominaStatusTone,
  formatNominaTitle,
} from '../../model/configuracion.selectors';
import s from './VersionesTable.module.css';

type Props = {
  emptyState?: ReactNode;
  items: VersionNominaDto[];
  metaText?: string;
  onSelect: (item: VersionNominaDto) => void;
  selectedId?: number | null;
  toolbar?: ReactNode;
};

export default function VersionesTable({
  emptyState,
  items,
  metaText,
  onSelect,
  selectedId,
  toolbar,
}: Props) {
  return (
    <section className={s.wrap}>
      <div className={s.header}>
        <h4 className={s.title}>Versiones registradas</h4>
        <span className={s.meta}>{metaText ?? `${items.length} registros`}</span>
      </div>

      {toolbar ? <div className={s.toolbarSlot}>{toolbar}</div> : null}

      {items.length > 0 ? (
        <div className={s.list}>
          {items.map((item) => {
            const tone = formatNominaStatusTone(item.status);
            const isSelected = item.versionId === selectedId;

            return (
              <button
                key={item.versionId}
                type="button"
                className={`${s.row} ${isSelected ? s.selected : ''}`}
                onClick={() => onSelect(item)}
              >
                <div className={s.identity}>
                  <div className={s.identityTop}>
                    <span className={s.idBadge}>#V{item.versionId}</span>
                    <span className={`${s.statusBadge} ${s[tone] ?? s.muted}`}>
                      {formatNominaStatusLabel(item.status)}
                    </span>
                  </div>

                  <div className={s.identityCopy}>
                    <strong>{item.periodCode || `Período ${item.payPeriodId}`}</strong>
                    <span>Cargada el {formatNominaDate(item.loadedAt)}</span>
                  </div>
                </div>

                <div className={s.details}>
                  <div className={s.detailPill}>
                    <span>Etapa</span>
                    <strong>{formatNominaTitle(item.stage)}</strong>
                  </div>

                  <div className={s.detailPill}>
                    <span>Período de pago</span>
                    <strong>{item.payPeriodId}</strong>
                  </div>

                  <div className={s.detailPill}>
                    <span>Señales</span>
                    <div className={s.signalChips}>
                      <span
                        className={`${s.signalChip} ${
                          item.isCurrent ? s.signalActive : ''
                        }`}
                      >
                        {item.isCurrent ? 'Vigente' : 'Histórica'}
                      </span>

                      <span
                        className={`${s.signalChip} ${
                          item.released ? s.signalActive : ''
                        }`}
                      >
                        {item.released ? 'Liberada' : 'Por liberar'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        emptyState
      )}
    </section>
  );
}
