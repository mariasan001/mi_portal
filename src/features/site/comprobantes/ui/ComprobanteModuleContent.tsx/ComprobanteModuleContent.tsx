'use client';

import type { ComprobanteAccessKey } from '../../types/comprobantes.types';
import ComprobanteCFDI from '../ComprobanteCFDI/ComprobanteCFDI';
import ComprobanteConstanciaAnualizada from '../ComprobanteConstanciaAnualizada/ComprobanteConstanciaAnualizada';
import ComprobanteQuincenalForm from '../ComprobanteQuincenalForm/ComprobanteQuincenalForm';
import s from './ComprobanteModuleContent.module.css';

type Props = {
  moduleKey: ComprobanteAccessKey;
};

/* Muestra el mismo componente ComprobanteQuincenalForm */
export default function ComprobanteModuleContent({ moduleKey }: Props) { 
  if (moduleKey === 'comprobante-quincenal' || moduleKey === 'constancia-quincenal') {
    return <ComprobanteQuincenalForm />;
  }

  if (moduleKey === 'constancia-anualizada') {
    return <ComprobanteConstanciaAnualizada />;
  }

  if (moduleKey === 'cfdi') {
    return <ComprobanteCFDI />;
  }

  return (
    <>
        
    </>
  );
}