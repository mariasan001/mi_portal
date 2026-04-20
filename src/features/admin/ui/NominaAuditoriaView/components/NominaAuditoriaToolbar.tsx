'use client';

import { Ban, Filter, Play, Search, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type {
  NominaAuditoriaAction,
  NominaAuditoriaCancellationFormState,
  NominaAuditoriaReleaseFormState,
} from '../types/nomina-auditoria-view.types';
import s from './NominaAuditoriaToolbar.module.css';

type Props = {
  activeAction: NominaAuditoriaAction;
  releaseForm: NominaAuditoriaReleaseFormState;
  cancellationForm: NominaAuditoriaCancellationFormState;
  loading: boolean;
  onUpdateReleaseField: (
    key: keyof NominaAuditoriaReleaseFormState,
    value: string
  ) => void;
  onUpdateCancellationField: (
    key: keyof NominaAuditoriaCancellationFormState,
    value: string
  ) => void;
  onExecute: () => void;
};

function getButtonLabel(
  action: NominaAuditoriaAction,
  loading: boolean
): string {
  if (action === 'liberaciones') {
    return loading ? 'Consultando...' : 'Consultar liberaciones';
  }

  return loading ? 'Consultando...' : 'Consultar cancelaciones';
}

export default function NominaAuditoriaToolbar({
  activeAction,
  releaseForm,
  cancellationForm,
  loading,
  onUpdateReleaseField,
  onUpdateCancellationField,
  onExecute,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const buttonLabel = getButtonLabel(activeAction, loading);

  return (
    <motion.section
      className={s.toolbar}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={s.shell}>
        {activeAction === 'liberaciones' ? (
          <div className={s.formLayout}>
            <div className={s.formBlock}>
              <div className={s.blockHeader}>
                <span className={s.blockKicker}>
                  <Filter size={14} />
                  Filtros principales
                </span>
              </div>

              <div className={s.primaryGrid}>
                <label className={s.field}>
                  <span>versionId</span>
                  <div className={s.inputWrap}>
                    <Search size={16} className={s.icon} />
                    <input
                      type="number"
                      min="1"
                      value={releaseForm.versionId}
                      onChange={(e) =>
                        onUpdateReleaseField('versionId', e.target.value)
                      }
                      placeholder="Ej. 125"
                    />
                  </div>
                </label>

                <label className={s.field}>
                  <span>payPeriodCode</span>
                  <div className={s.inputWrap}>
                    <ShieldCheck size={16} className={s.icon} />
                    <input
                      value={releaseForm.payPeriodCode}
                      onChange={(e) =>
                        onUpdateReleaseField('payPeriodCode', e.target.value)
                      }
                      placeholder="Ej. 2025-06"
                    />
                  </div>
                </label>

                <label className={s.field}>
                  <span>stage</span>
                  <div className={s.inputWrap}>
                    <ShieldCheck size={16} className={s.icon} />
                    <input
                      value={releaseForm.stage}
                      onChange={(e) =>
                        onUpdateReleaseField('stage', e.target.value)
                      }
                      placeholder="Ej. INTEGRADA"
                    />
                  </div>
                </label>
              </div>

              <div className={s.actions}>
                <motion.button
                  type="button"
                  className={s.executeBtn}
                  onClick={onExecute}
                  disabled={loading}
                  whileHover={
                    !shouldReduceMotion && !loading
                      ? { y: -1, transition: { duration: 0.16 } }
                      : undefined
                  }
                  whileTap={
                    !shouldReduceMotion && !loading ? { scale: 0.99 } : undefined
                  }
                >
                  <Play size={16} />
                  <span>{buttonLabel}</span>
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className={s.formLayout}>
            <div className={s.formBlock}>
              <div className={s.blockHeader}>
                <span className={s.blockKicker}>
                  <Filter size={14} />
                  Identificadores
                </span>
              </div>

              <div className={s.primaryGrid}>
                <label className={s.field}>
                  <span>receiptId</span>
                  <div className={s.inputWrap}>
                    <Search size={16} className={s.icon} />
                    <input
                      type="number"
                      min="1"
                      value={cancellationForm.receiptId}
                      onChange={(e) =>
                        onUpdateCancellationField('receiptId', e.target.value)
                      }
                      placeholder="Ej. 4501"
                    />
                  </div>
                </label>

                <label className={s.field}>
                  <span>claveSp</span>
                  <div className={s.inputWrap}>
                    <Ban size={16} className={s.icon} />
                    <input
                      value={cancellationForm.claveSp}
                      onChange={(e) =>
                        onUpdateCancellationField('claveSp', e.target.value)
                      }
                      placeholder="Ej. ABC123"
                    />
                  </div>
                </label>

                <label className={s.field}>
                  <span>nominaTipo</span>
                  <div className={s.inputWrap}>
                    <Ban size={16} className={s.icon} />
                    <input
                      type="number"
                      value={cancellationForm.nominaTipo}
                      onChange={(e) =>
                        onUpdateCancellationField('nominaTipo', e.target.value)
                      }
                      placeholder="Ej. 1"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className={s.formBlock}>
              <div className={s.blockHeader}>
                <span className={s.blockKicker}>
                  <Filter size={14} />
                  Contexto de periodos
                </span>
              </div>

              <div className={s.secondaryGrid}>
                <label className={s.field}>
                  <span>payPeriodCode</span>
                  <div className={s.inputWrap}>
                    <Ban size={16} className={s.icon} />
                    <input
                      value={cancellationForm.payPeriodCode}
                      onChange={(e) =>
                        onUpdateCancellationField('payPeriodCode', e.target.value)
                      }
                      placeholder="Ej. 2025-06"
                    />
                  </div>
                </label>

                <label className={s.field}>
                  <span>receiptPeriodCode</span>
                  <div className={s.inputWrap}>
                    <Ban size={16} className={s.icon} />
                    <input
                      value={cancellationForm.receiptPeriodCode}
                      onChange={(e) =>
                        onUpdateCancellationField(
                          'receiptPeriodCode',
                          e.target.value
                        )
                      }
                      placeholder="Ej. 2025-06-Q1"
                    />
                  </div>
                </label>
              </div>

              <div className={s.actions}>
                <motion.button
                  type="button"
                  className={s.executeBtn}
                  onClick={onExecute}
                  disabled={loading}
                  whileHover={
                    !shouldReduceMotion && !loading
                      ? { y: -1, transition: { duration: 0.16 } }
                      : undefined
                  }
                  whileTap={
                    !shouldReduceMotion && !loading ? { scale: 0.99 } : undefined
                  }
                >
                  <Play size={16} />
                  <span>{buttonLabel}</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
