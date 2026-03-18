import { COMPROBANTES_ACCESS_ITEMS } from '../../constants/comprobantesConstants';
import ComprobantesAccessCard from '../ComprobantesAccessCard/ComprobantesAccessCard';
import s from './ComprobantesAccessGrid.module.css';

export default function ComprobantesAccessGrid() {
  return (
    <div className={s.grid} role="list">
      {COMPROBANTES_ACCESS_ITEMS.map((item) => (
        <div key={item.href} className={s.item} role="listitem">
          <ComprobantesAccessCard item={item} />
        </div>
      ))}
    </div>
  );
}