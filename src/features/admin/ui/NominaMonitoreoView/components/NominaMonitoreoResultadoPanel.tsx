import {
  Activity,
  CalendarDays,
  CheckCircle2,
  FileText,
  Hash,
  Layers3,
  ShieldCheck,
  UserCircle2,
  XCircle,
} from 'lucide-react';

import s from './NominaMonitoreoResultadoPanel.module.css';
import { NominaPeriodoEstadoDto } from '@/features/admin/types/nomina-monitoreo.types';

type Props = {
  detalle: NominaPeriodoEstadoDto;
};

function boolLabel(value: boolean) {
  return value ? 'Sí' : 'No';
}

function formatDate(value: string | null) {
  if (!value) return 'Sin fecha registrada';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

export default function NominaMonitoreoResultadoPanel({ detalle }: Props) {
  return (
    <section className={s.panel}>
      <div className={s.intro}>
        <div className={s.introBadge}>
          <Activity size={14} />
          Resultado del monitoreo
        </div>

        <div className={s.introCopy}>
          <h4>Estado consolidado del periodo</h4>
          <p>
            Revisa las banderas de carga, validación, liberación y versiones
            actuales del periodo consultado.
          </p>
        </div>
      </div>

      <dl className={s.grid}>
        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>ID de estado</dt>
          </div>
          <dd>{detalle.periodStateId}</dd>
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

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FileText size={15} />
            </div>
            <dt>Código del periodo</dt>
          </div>
          <dd>{detalle.periodCode}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CalendarDays size={15} />
            </div>
            <dt>Año</dt>
          </div>
          <dd>{detalle.anio}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CalendarDays size={15} />
            </div>
            <dt>Quincena</dt>
          </div>
          <dd>{detalle.quincena}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Layers3 size={15} />
            </div>
            <dt>Versión previa actual</dt>
          </div>
          <dd>{detalle.currentPreviaVersionId}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Layers3 size={15} />
            </div>
            <dt>Versión integrada actual</dt>
          </div>
          <dd>{detalle.currentIntegradaVersionId}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <ShieldCheck size={15} />
            </div>
            <dt>Fecha de liberación</dt>
          </div>
          <dd>{formatDate(detalle.releasedAt)}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <UserCircle2 size={15} />
            </div>
            <dt>Usuario que liberó</dt>
          </div>
          <dd>{detalle.releasedByUserId ?? 'Sin dato registrado'}</dd>
        </div>
      </dl>

      <div className={s.flagsSection}>
        <div className={s.flagsHeader}>
          <h5>Banderas del proceso</h5>
          <p>Resumen operativo del estado actual del periodo consultado.</p>
        </div>

        <div className={s.flagsGrid}>
          <div className={detalle.previaLoaded ? s.flagOk : s.flagOff}>
            <div className={s.flagHead}>
              <CheckCircle2 size={16} />
              <span>Previa cargada</span>
            </div>
            <strong>{boolLabel(detalle.previaLoaded)}</strong>
          </div>

          <div className={detalle.integradaLoaded ? s.flagOk : s.flagOff}>
            <div className={s.flagHead}>
              <CheckCircle2 size={16} />
              <span>Integrada cargada</span>
            </div>
            <strong>{boolLabel(detalle.integradaLoaded)}</strong>
          </div>

          <div className={detalle.catalogLoaded ? s.flagOk : s.flagOff}>
            <div className={s.flagHead}>
              <CheckCircle2 size={16} />
              <span>Catálogo cargado</span>
            </div>
            <strong>{boolLabel(detalle.catalogLoaded)}</strong>
          </div>

          <div className={detalle.validated ? s.flagOk : s.flagOff}>
            <div className={s.flagHead}>
              <CheckCircle2 size={16} />
              <span>Validado</span>
            </div>
            <strong>{boolLabel(detalle.validated)}</strong>
          </div>

          <div className={detalle.released ? s.flagOk : s.flagOff}>
            <div className={s.flagHead}>
              <ShieldCheck size={16} />
              <span>Liberado</span>
            </div>
            <strong>{boolLabel(detalle.released)}</strong>
          </div>

          <div className={detalle.hasCancellations ? s.flagWarn : s.flagOff}>
            <div className={s.flagHead}>
              <XCircle size={16} />
              <span>Tiene cancelaciones</span>
            </div>
            <strong>{boolLabel(detalle.hasCancellations)}</strong>
          </div>

          <div className={detalle.hasReexpeditions ? s.flagWarn : s.flagOff}>
            <div className={s.flagHead}>
              <FileText size={16} />
              <span>Tiene reexpediciones</span>
            </div>
            <strong>{boolLabel(detalle.hasReexpeditions)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}