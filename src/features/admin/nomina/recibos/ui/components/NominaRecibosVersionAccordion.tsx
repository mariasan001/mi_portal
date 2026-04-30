import { ChevronDown, Play, ShieldCheck } from 'lucide-react';

import type {
  RecibosAction,
  RecibosFormState,
  RecibosStepItem,
  RecibosVersionCardItem,
} from '@/features/admin/nomina/recibos/model/recibos.types';

import RecibosResultPanel from './RecibosResultPanel';
import s from './NominaRecibosVersionAccordion.module.css';

type Props = {
  items: RecibosVersionCardItem[];
  selectedVersionId: string;
  activeAction: RecibosAction;
  loading: boolean;
  technicalFlowLoading: boolean;
  technicalFlowVersionId: string;
  form: RecibosFormState;
  results: {
    snapshots: Record<string, unknown> | null;
    receipts: Record<string, unknown> | null;
    coreSync: Record<string, unknown> | null;
    release: Record<string, unknown> | null;
  };
  onSelectVersion: (value: string) => void;
  onSelectAction: (value: RecibosAction) => void;
  onUpdateField: (key: keyof RecibosFormState, value: string) => void;
  onExecuteStep: (value: RecibosAction) => void;
  onExecuteTechnicalFlow: (versionId: number) => void;
};

function getActionLabel(action: RecibosAction, loading: boolean, step: RecibosStepItem) {
  if (loading) {
    if (action === 'sincronizacion') return 'Sincronizando...';
    if (action === 'liberacion') return 'Liberando...';
    return 'Generando...';
  }

  if (step.status === 'done') {
    return action === 'liberacion' ? 'Ya liberado' : 'Ya ejecutado';
  }

  if (step.status === 'blocked') {
    return 'No disponible';
  }

  if (action === 'snapshots') return 'Generar snapshots';
  if (action === 'recibos') return 'Generar recibos';
  if (action === 'sincronizacion') return 'Sincronizar';
  return 'Liberar version';
}

function getResultData(action: RecibosAction, results: Props['results']) {
  if (action === 'snapshots') return results.snapshots;
  if (action === 'recibos') return results.receipts;
  if (action === 'sincronizacion') return results.coreSync;
  return results.release;
}

export default function NominaRecibosVersionAccordion({
  items,
  selectedVersionId,
  activeAction,
  loading,
  technicalFlowLoading,
  technicalFlowVersionId,
  form,
  results,
  onSelectVersion,
  onSelectAction,
  onUpdateField,
  onExecuteStep,
  onExecuteTechnicalFlow,
}: Props) {
  return (
    <section className={s.section}>
      {items.map((item) => {
        const isOpen = selectedVersionId === String(item.version.versionId);
        const completedCount = item.steps.filter((step) => step.status === 'done').length;
        const technicalSteps = item.steps.filter((step) => step.key !== 'liberacion');
        const completedTechnicalCount = technicalSteps.filter(
          (step) => step.status === 'done'
        ).length;
        const technicalDone = technicalSteps.every((step) => step.status === 'done');
        const isTechnicalFlowActive =
          technicalFlowLoading &&
          technicalFlowVersionId === String(item.version.versionId);

        return (
          <article
            key={item.version.versionId}
            className={`${s.card} ${isOpen ? s.cardOpen : ''}`}
          >
            <button
              type="button"
              className={s.header}
              onClick={() => onSelectVersion(String(item.version.versionId))}
            >
              <div className={s.identity}>
                <strong>{`Version ${item.version.periodCode}`}</strong>
                <span>{item.subtitle}</span>
              </div>

              <div className={s.meta}>
                <span className={s.metaText}>{`${completedCount} de 4 pasos`}</span>
                <span className={`${s.pill} ${s[item.progressTone]}`}>{item.progressLabel}</span>
                <span className={`${s.pill} ${s[item.statusTone]}`}>{item.statusLabel}</span>
                <span className={`${s.chevron} ${isOpen ? s.chevronOpen : ''}`}>
                  <ChevronDown size={18} />
                </span>
              </div>
            </button>

            {isOpen ? (
              <div className={s.body}>
                <div className={s.flowBar}>
                  <div className={s.flowCopy}>
                    <strong>Flujo tecnico</strong>
                    <span>Snapshots, recibos y sincronizacion se ejecutan en orden.</span>
                  </div>

                  <button
                    type="button"
                    className={`${s.flowButton} ${technicalDone ? s.flowButtonDone : ''}`}
                    disabled={technicalDone || isTechnicalFlowActive}
                    onClick={() => onExecuteTechnicalFlow(item.version.versionId)}
                  >
                    <Play size={15} />
                    <span>
                      {isTechnicalFlowActive
                        ? 'Ejecutando flujo...'
                        : technicalDone
                          ? 'Flujo completado'
                          : completedTechnicalCount > 0
                            ? 'Continuar flujo'
                            : 'Iniciar flujo'}
                    </span>
                  </button>
                </div>

                {item.steps.map((step) => {
                  const isActive = activeAction === step.key;
                  const isStepLoading = isActive && loading;
                  const data = getResultData(step.key, results);

                  return (
                    <section
                      key={step.key}
                      className={`${s.stepCard} ${s[step.status]} ${
                        isActive ? s.stepCardActive : ''
                      }`}
                    >
                      <div className={s.stepMain}>
                        <div className={s.stepCopy}>
                          <div className={s.stepHead}>
                            <strong>{step.label}</strong>
                          </div>

                          <p>{step.description}</p>
                        </div>

                        <div className={s.stepActions}>
                          <button
                            type="button"
                            className={`${s.runBtn} ${
                              step.key === 'liberacion'
                                ? s.runBtnRelease
                                : step.status === 'blocked'
                                  ? s.runBtnMuted
                                  : ''
                            }`}
                            disabled={!step.canExecute || isStepLoading}
                            onClick={async () => {
                              onSelectAction(step.key);
                              await onExecuteStep(step.key);
                            }}
                          >
                            {step.key === 'liberacion' ? (
                              <ShieldCheck size={16} />
                            ) : (
                              <Play size={16} />
                            )}
                            <span>{getActionLabel(step.key, isStepLoading, step)}</span>
                          </button>
                        </div>
                      </div>

                      {step.key === 'liberacion' ? (
                        <div className={s.releaseFields}>
                          <label className={`${s.field} ${s.fieldWide}`}>
                            <span>Comentarios de liberacion</span>
                            <textarea
                              value={form.comments}
                              onChange={(event) =>
                                onUpdateField('comments', event.target.value)
                              }
                              placeholder="Agrega una referencia breve sobre esta liberacion."
                              rows={3}
                            />
                            <small>
                              Este comentario viajara junto con la liberacion de la version.
                            </small>
                          </label>
                        </div>
                      ) : null}

                      {isActive && data ? (
                        <div className={s.resultWrap}>
                          <RecibosResultPanel
                            title={step.label}
                            data={data}
                            emptyText="Aun no hay resultado tecnico para este paso."
                            tone={step.key === 'liberacion' ? 'secondary' : 'primary'}
                          />
                        </div>
                      ) : null}
                    </section>
                  );
                })}
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
