import type { ReactNode } from 'react';
import { Ban, Filter, Play, Search, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type {
  AuditoriaAction as NominaAuditoriaAction,
  AuditoriaCancellationFormState as NominaAuditoriaCancellationFormState,
  AuditoriaReleaseFormState as NominaAuditoriaReleaseFormState,
} from '../../model/auditoria.types';
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

type FieldProps = {
  children?: ReactNode;
  icon: ReactNode;
  input: ReactNode;
  label: string;
};

type BlockProps = {
  description?: string;
  children: ReactNode;
  title: string;
};

type FieldSpec<FormState> = {
  field: keyof FormState;
  icon: ReactNode;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
  label: string;
  min?: string;
  placeholder: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
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

const releaseFields: FieldSpec<NominaAuditoriaReleaseFormState>[] = [
  {
    field: 'versionId',
    label: 'Versión',
    icon: <Search size={16} className={s.icon} />,
    type: 'number',
    inputMode: 'numeric',
    min: '1',
    placeholder: 'Ej. 125',
  },
  {
    field: 'payPeriodCode',
    label: 'Período de pago',
    icon: <ShieldCheck size={16} className={s.icon} />,
    placeholder: 'Ej. 2025-06',
  },
  {
    field: 'stage',
    label: 'Etapa',
    icon: <ShieldCheck size={16} className={s.icon} />,
    placeholder: 'Ej. INTEGRADA',
  },
];

const cancellationIdentityFields: FieldSpec<NominaAuditoriaCancellationFormState>[] = [
  {
    field: 'receiptId',
    label: 'Recibo',
    icon: <Search size={16} className={s.icon} />,
    type: 'number',
    inputMode: 'numeric',
    min: '1',
    placeholder: 'Ej. 4501',
  },
  {
    field: 'claveSp',
    label: 'Clave SP',
    icon: <Ban size={16} className={s.icon} />,
    placeholder: 'Ej. ABC123',
  },
  {
    field: 'nominaTipo',
    label: 'Tipo de nómina',
    icon: <Ban size={16} className={s.icon} />,
    type: 'number',
    inputMode: 'numeric',
    placeholder: 'Ej. 1',
  },
];

const cancellationPeriodFields: FieldSpec<NominaAuditoriaCancellationFormState>[] = [
  {
    field: 'payPeriodCode',
    label: 'Período de pago',
    icon: <Ban size={16} className={s.icon} />,
    placeholder: 'Ej. 2025-06',
  },
  {
    field: 'receiptPeriodCode',
    label: 'Período de recibo',
    icon: <Ban size={16} className={s.icon} />,
    placeholder: 'Ej. 2025-06-Q1',
  },
];

function Block({ children, title, description }: BlockProps) {
  return (
    <div className={s.formBlock}>
      <div className={s.blockHeader}>
        <div className={s.blockHeaderCopy}>
          <span className={s.blockKicker}>
            <Filter size={14} />
            {title}
          </span>

          {description ? <p className={s.blockDescription}>{description}</p> : null}
        </div>
      </div>

      {children}
    </div>
  );
}

function Field({ icon, input, label }: FieldProps) {
  return (
    <label className={s.field}>
      <span>{label}</span>
      <div className={s.inputWrap}>
        {icon}
        {input}
      </div>
    </label>
  );
}

function ExecuteButton({
  loading,
  onExecute,
  shouldReduceMotion,
  label,
}: {
  label: string;
  loading: boolean;
  onExecute: () => void;
  shouldReduceMotion: boolean;
}) {
  return (
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
      whileTap={!shouldReduceMotion && !loading ? { scale: 0.99 } : undefined}
    >
      <Play size={16} />
      <span>{label}</span>
    </motion.button>
  );
}

function ReleaseFields({
  form,
  onUpdateField,
}: {
  form: NominaAuditoriaReleaseFormState;
  onUpdateField: (
    key: keyof NominaAuditoriaReleaseFormState,
    value: string
  ) => void;
}) {
  return releaseFields.map((field) => (
    <Field
      key={String(field.field)}
      label={field.label}
      icon={field.icon}
      input={
        <input
          type={field.type}
          min={field.min}
          inputMode={field.inputMode}
          value={form[field.field]}
          onChange={(event) => onUpdateField(field.field, event.target.value)}
          placeholder={field.placeholder}
        />
      }
    />
  ));
}

function CancellationIdentityFields({
  form,
  onUpdateField,
}: {
  form: NominaAuditoriaCancellationFormState;
  onUpdateField: (
    key: keyof NominaAuditoriaCancellationFormState,
    value: string
  ) => void;
}) {
  return cancellationIdentityFields.map((field) => (
    <Field
      key={String(field.field)}
      label={field.label}
      icon={field.icon}
      input={
        <input
          type={field.type}
          min={field.min}
          inputMode={field.inputMode}
          value={form[field.field]}
          onChange={(event) => onUpdateField(field.field, event.target.value)}
          placeholder={field.placeholder}
        />
      }
    />
  ));
}

function CancellationPeriodFields({
  form,
  onUpdateField,
}: {
  form: NominaAuditoriaCancellationFormState;
  onUpdateField: (
    key: keyof NominaAuditoriaCancellationFormState,
    value: string
  ) => void;
}) {
  return cancellationPeriodFields.map((field) => (
    <Field
      key={String(field.field)}
      label={field.label}
      icon={field.icon}
      input={
        <input
          type={field.type}
          min={field.min}
          inputMode={field.inputMode}
          value={form[field.field]}
          onChange={(event) => onUpdateField(field.field, event.target.value)}
          placeholder={field.placeholder}
        />
      }
    />
  ));
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
            <Block
              title="Filtros principales"
              description="Ubica eventos por versión, período y etapa registrada en la liberación."
            >
              <div className={s.primaryGrid}>
                <ReleaseFields
                  form={releaseForm}
                  onUpdateField={onUpdateReleaseField}
                />

                <div className={`${s.actions} ${s.inlineAction}`}>
                  <ExecuteButton
                    label={buttonLabel}
                    loading={loading}
                    onExecute={onExecute}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </div>
              </div>
            </Block>
          </div>
        ) : (
          <div className={s.formLayout}>
            <Block
              title="Identificadores"
              description="Busca una cancelación por recibo, clave SP o tipo de nómina."
            >
              <div className={s.primaryGrid}>
                <CancellationIdentityFields
                  form={cancellationForm}
                  onUpdateField={onUpdateCancellationField}
                />
              </div>
            </Block>

            <Block
              title="Contexto de períodos"
              description="Complementa la búsqueda con el período de pago o el período del recibo."
            >
              <div className={s.secondaryGrid}>
                <CancellationPeriodFields
                  form={cancellationForm}
                  onUpdateField={onUpdateCancellationField}
                />
              </div>

              <div className={s.actions}>
                <ExecuteButton
                  label={buttonLabel}
                  loading={loading}
                  onExecute={onExecute}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            </Block>
          </div>
        )}
      </div>
    </motion.section>
  );
}
