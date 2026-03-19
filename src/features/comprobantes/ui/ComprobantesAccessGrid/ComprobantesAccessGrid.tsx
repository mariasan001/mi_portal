import { COMPROBANTES_ACCESS_ITEMS } from '../../constants/comprobantesConstants';
import type { ComprobanteAccessKey } from '../../types/comprobantes.types';

import ComprobantesAccessCard from '../ComprobantesAccessCard/ComprobantesAccessCard';
import s from './ComprobantesAccessGrid.module.css';

type Props = {
  onSelect: (key: ComprobanteAccessKey) => void;
};

/**
 * Grid principal de accesos del módulo.
 */
export default function ComprobantesAccessGrid({ onSelect }: Props) {
  return (
    <div className={s.grid} role="list">
      {COMPROBANTES_ACCESS_ITEMS.map((item, index) => (
        <div key={item.key} className={s.item} role="listitem">
          <ComprobantesAccessCard
            item={item}
            index={index}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );
}