import { Play, Search, ShieldCheck, Ban } from 'lucide-react';
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

export default function NominaAuditoriaToolbar({
  activeAction,
  releaseForm,
  cancellationForm,
  loading,
  onUpdateReleaseField,
  onUpdateCancellationField,
  onExecute,
}: Props) {
  const isLiberaciones = activeAction === 'liberaciones';

  return (
    <section className={s.toolbar}>
      <div className={s.fieldsGrid}>
        {isLiberaciones ? (
          <>
            <label className={s.field}>
              <span>Version ID</span>
              <div className={s.inputWrap}>
                <Search size={17} className={s.icon} />
                <input
                  type="number"
                  value={releaseForm.versionId}
                  onChange={(e) => onUpdateReleaseField('versionId', e.target.value)}
                  placeholder="Ej. 125"
                />
              </div>
            </label>

            <label className={s.field}>
              <span>Pay period code</span>
              <div className={s.inputWrap}>
                <ShieldCheck size={17} className={s.icon} />
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
              <span>Stage</span>
              <div className={s.inputWrap}>
                <ShieldCheck size={17} className={s.icon} />
                <input
                  value={releaseForm.stage}
                  onChange={(e) => onUpdateReleaseField('stage', e.target.value)}
                  placeholder="Ej. INTEGRADA"
                />
              </div>
            </label>

            <label className={s.field}>
              <span>Limit</span>
              <div className={s.inputWrap}>
                <Search size={17} className={s.icon} />
                <input
                  type="number"
                  value={releaseForm.limit}
                  onChange={(e) => onUpdateReleaseField('limit', e.target.value)}
                />
              </div>
            </label>

            <label className={s.field}>
              <span>Offset</span>
              <div className={s.inputWrap}>
                <Search size={17} className={s.icon} />
                <input
                  type="number"
                  value={releaseForm.offset}
                  onChange={(e) => onUpdateReleaseField('offset', e.target.value)}
                />
              </div>
            </label>
          </>
        ) : (
          <>
            <label className={s.field}>
              <span>Receipt ID</span>
              <div className={s.inputWrap}>
                <Search size={17} className={s.icon} />
                <input
                  type="number"
                  value={cancellationForm.receiptId}
                  onChange={(e) =>
                    onUpdateCancellationField('receiptId', e.target.value)
                  }
                  placeholder="Ej. 4501"
                />
              </div>
            </label>

            <label className={s.field}>
              <span>Clave SP</span>
              <div className={s.inputWrap}>
                <Ban size={17} className={s.icon} />
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
              <span>Pay period code</span>
              <div className={s.inputWrap}>
                <Ban size={17} className={s.icon} />
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
              <span>Receipt period code</span>
              <div className={s.inputWrap}>
                <Ban size={17} className={s.icon} />
                <input
                  value={cancellationForm.receiptPeriodCode}
                  onChange={(e) =>
                    onUpdateCancellationField('receiptPeriodCode', e.target.value)
                  }
                  placeholder="Ej. 2025-06-Q1"
                />
              </div>
            </label>

            <label className={s.field}>
              <span>Nómina tipo</span>
              <div className={s.inputWrap}>
                <Ban size={17} className={s.icon} />
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

            <label className={s.field}>
              <span>Limit</span>
              <div className={s.inputWrap}>
                <Search size={17} className={s.icon} />
                <input
                  type="number"
                  value={cancellationForm.limit}
                  onChange={(e) =>
                    onUpdateCancellationField('limit', e.target.value)
                  }
                />
              </div>
            </label>

            <label className={s.field}>
              <span>Offset</span>
              <div className={s.inputWrap}>
                <Search size={17} className={s.icon} />
                <input
                  type="number"
                  value={cancellationForm.offset}
                  onChange={(e) =>
                    onUpdateCancellationField('offset', e.target.value)
                  }
                />
              </div>
            </label>
          </>
        )}
      </div>

      <div className={s.actions}>
        <button type="button" className={s.executeBtn} onClick={onExecute}>
          <Play size={17} />
          <span>{loading ? 'Consultando...' : 'Consultar auditoría'}</span>
        </button>
      </div>
    </section>
  );
}