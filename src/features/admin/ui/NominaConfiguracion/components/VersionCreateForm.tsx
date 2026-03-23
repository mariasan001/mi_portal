'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  FileText,
  Hash,
  Layers3,
  ShieldUser,
} from 'lucide-react';

import type {
  CrearVersionNominaPayload,
  NominaStage,
  VersionNominaDto,
} from '../../../types/nomina-versiones.types';

import s from './VersionCreateForm.module.css';
import {
  formatNominaBool,
  formatNominaDate,
} from '../utils/nomina-configuracion.utils';

type Props = {
  loading: boolean;
  ultimaCreada: VersionNominaDto | null;
  onSubmit: (payload: CrearVersionNominaPayload) => Promise<void>;
};

export default function VersionCreateForm({
  loading,
  ultimaCreada,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CrearVersionNominaPayload>({
    payPeriodId: 0,
    stage: 'PREVIA',
    notes: '',
    createdByUserId: 0,
  });

  const canSubmit = useMemo(() => {
    return (
      Number.isFinite(form.payPeriodId) &&
      form.payPeriodId > 0 &&
      (form.stage === 'PREVIA' || form.stage === 'INTEGRADA') &&
      Number.isFinite(form.createdByUserId) &&
      form.createdByUserId > 0 &&
      !loading
    );
  }, [form, loading]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canSubmit) return;
    await onSubmit(form);
  }

  return (
    <div className={s.layout}>
      <section className={s.formPanel}>
        <div className={s.intro}>
          <div className={s.introBadge}>
            <Layers3 size={14} />
            Configuración de versión
          </div>

          <div className={s.introCopy}>
            <h4>Crear o recuperar versión de nómina</h4>
            <p>
              Registra la información principal de la versión vinculada al
              periodo de pago seleccionado.
            </p>
          </div>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.grid}>
            <label className={s.field}>
              <div className={s.fieldHead}>
                <div className={s.iconWrap}>
                  <Hash size={15} />
                </div>
                <span>Periodo de pago</span>
              </div>

              <input
                type="number"
                min="1"
                value={form.payPeriodId || ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    payPeriodId: Number(e.target.value),
                  }))
                }
                placeholder="Ej. 4"
              />
            </label>

            <label className={s.field}>
              <div className={s.fieldHead}>
                <div className={s.iconWrap}>
                  <Layers3 size={15} />
                </div>
                <span>Etapa</span>
              </div>

              <select
                value={form.stage}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    stage: e.target.value as NominaStage,
                  }))
                }
              >
                <option value="PREVIA">PREVIA</option>
                <option value="INTEGRADA">INTEGRADA</option>
              </select>
            </label>

            <label className={`${s.field} ${s.fieldWide}`}>
              <div className={s.fieldHead}>
                <div className={s.iconWrap}>
                  <FileText size={15} />
                </div>
                <span>Notas</span>
              </div>

              <textarea
                rows={5}
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Escribe aquí observaciones de la versión"
              />
            </label>

            <label className={s.field}>
              <div className={s.fieldHead}>
                <div className={s.iconWrap}>
                  <ShieldUser size={15} />
                </div>
                <span>Usuario creador</span>
              </div>

              <input
                type="number"
                min="1"
                value={form.createdByUserId || ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    createdByUserId: Number(e.target.value),
                  }))
                }
                placeholder="Ej. 1"
              />
            </label>
          </div>

          <div className={s.actions}>
            <button type="submit" className={s.submitBtn} disabled={!canSubmit}>
              {loading ? 'Procesando...' : 'Crear versión'}
            </button>
          </div>
        </form>
      </section>

      <aside className={s.resultPanel}>
        <div className={s.intro}>
          <div className={s.introBadge}>
            <FileText size={14} />
            Resultado de la versión
          </div>

          <div className={s.introCopy}>
            <h4>Última versión registrada</h4>
            <p>
              Revisa la información principal de la versión generada más
              recientemente.
            </p>
          </div>
        </div>

        {ultimaCreada ? (
          <dl className={s.resultGrid}>
            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Hash size={15} />
                </div>
                <dt>ID de versión</dt>
              </div>
              <dd>{ultimaCreada.versionId}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Hash size={15} />
                </div>
                <dt>Periodo de pago</dt>
              </div>
              <dd>{ultimaCreada.payPeriodId}</dd>
            </div>

            <div className={`${s.item} ${s.itemWide}`}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FileText size={15} />
                </div>
                <dt>Código del periodo</dt>
              </div>
              <dd>{ultimaCreada.periodCode}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Layers3 size={15} />
                </div>
                <dt>Etapa</dt>
              </div>
              <dd>{ultimaCreada.stage}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Layers3 size={15} />
                </div>
                <dt>Estatus</dt>
              </div>
              <dd>{ultimaCreada.status}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Layers3 size={15} />
                </div>
                <dt>Actual</dt>
              </div>
              <dd>{formatNominaBool(ultimaCreada.isCurrent)}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Layers3 size={15} />
                </div>
                <dt>Liberada</dt>
              </div>
              <dd>{formatNominaBool(ultimaCreada.released)}</dd>
            </div>

            <div className={`${s.item} ${s.itemWide}`}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FileText size={15} />
                </div>
                <dt>Notas</dt>
              </div>
              <dd>{ultimaCreada.notes || 'Sin observaciones registradas'}</dd>
            </div>

            <div className={`${s.item} ${s.itemWide}`}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FileText size={15} />
                </div>
                <dt>Fecha de carga</dt>
              </div>
              <dd>{formatNominaDate(ultimaCreada.loadedAt)}</dd>
            </div>
          </dl>
        ) : (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <FileText size={18} />
            </div>

            <div className={s.emptyCopy}>
              <h5>Aún no hay versiones registradas</h5>
              <p>
                Cuando generes una nueva versión, su información aparecerá aquí
                para consulta inmediata.
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}