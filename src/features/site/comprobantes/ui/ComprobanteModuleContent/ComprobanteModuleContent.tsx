'use client';

import type { ComprobanteAccessKey } from '../../model/comprobantes.types';
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
      <h3 className={s.placeholderTitle}>Modulo en construccion</h3>
      <p className={s.placeholderText}>
        Esta seccion estara disponible proximamente con su formulario correspondiente.
      </p>
    </div>
  );
}
