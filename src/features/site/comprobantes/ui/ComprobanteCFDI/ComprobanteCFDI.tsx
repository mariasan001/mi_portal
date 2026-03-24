import s from './ComprobanteCFDI.module.css';

import { useState, type ChangeEvent } from 'react';
import { ArrowUpRight, CalendarDays, CircleHelp } from 'lucide-react';

export default function ComprobanteCFDI() {
    return(
        <div className={s.wrap}>
        <button
          type="button"
          className={s.primaryBtn}
                
        >
          <span className={s.primaryBtnText}>CFDI XML Quincenales</span>

          <span className={s.primaryBtnIcon} aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </button>
        <button
          type="button"
          className={s.primaryBtn}
                
        >
          <span className={s.primaryBtnText}>CFDI PDF Quincenales</span>

          <span className={s.primaryBtnIcon} aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </button>
        <button
          type="button"
          className={s.primaryBtn}
                
        >
          <span className={s.primaryBtnText}>CFDI Anualizados</span>

          <span className={s.primaryBtnIcon} aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </button>
        </div>

       
        
    )

}