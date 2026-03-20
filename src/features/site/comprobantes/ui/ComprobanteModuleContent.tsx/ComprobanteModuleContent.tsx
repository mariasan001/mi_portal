'use client';

import type { ComprobanteAccessKey } from '../../types/comprobantes.types';
import ComprobanteQuincenalForm from '../ComprobanteQuincenalForm/ComprobanteQuincenalForm';
import s from './ComprobanteModuleContent.module.css';

type Props = {
  moduleKey: ComprobanteAccessKey;
};

export default function ComprobanteModuleContent({ moduleKey }: Props) {
  if (moduleKey === 'comprobante-quincenal') {
    return <ComprobanteQuincenalForm />;
  }

  return (
    <div className={s.placeholder}>
      <h3 className={s.placeholderTitle}>Módulo en construcción</h3>
      <p className={s.placeholderText}>
        Esta sección estará disponible próximamente con su formulario correspondiente.
      </p>
    </div>
  );
}