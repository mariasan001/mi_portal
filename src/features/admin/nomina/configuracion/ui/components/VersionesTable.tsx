import type { ReactNode } from 'react';
import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';
import {
  formatNominaBool,
  formatNominaCompactPeriod,
  formatNominaDateTimeLong,
  formatNominaStatusTone,
  formatNominaTitle,
} from '../../model/configuracion.selectors';
import s from './ConfiguracionDataTable.module.css';

type Props = {
  items: VersionNominaDto[];
  selectedId?: number | null;
  onSelect: (item: VersionNominaDto) => void;
  toolbar?: ReactNode;
};

export default function VersionesTable({
  items,
  selectedId,
  onSelect,
  toolbar,
}: Props) {
  return (
    <section className={s.wrap}>
      <div className={s.header}>
        <h4 className={s.title}>Versiones registradas</h4>
        <span className={s.meta}>{items.length} registros</span>
      </div>

      {toolbar ? <div className={s.toolbarSlot}>{toolbar}</div> : null}

      <div className={s.surface}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Versión</th>
              <th>Período</th>
              <th>Etapa</th>
              <th>Estatus</th>
              <th>Actual</th>
              <th>Liberada</th>
              <th>Carga</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const tone = formatNominaStatusTone(item.status);
              return (
                <tr
                  key={item.versionId}
                  className={item.versionId === selectedId ? s.selected : undefined}
                >
                  <td>
                    <button
                      type="button"
                      className={`${s.rowButton} ${s.strong}`}
                      onClick={() => onSelect(item)}
                    >
                      {item.versionId}
                    </button>
                  </td>
                  <td>
                    {formatNominaCompactPeriod(item.anio, item.quincena, item.periodCode)}
                  </td>
                  <td>{formatNominaTitle(item.stage)}</td>
                  <td>
                    <span
                      className={`${s.badge} ${
                        tone === 'muted' ? s.statusMuted : s[tone]
                      }`}
                    >
                      {formatNominaTitle(item.status)}
                    </span>
                  </td>
                  <td>{formatNominaBool(item.isCurrent)}</td>
                  <td>{formatNominaBool(item.released)}</td>
                  <td className={s.muted}>{formatNominaDateTimeLong(item.loadedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
