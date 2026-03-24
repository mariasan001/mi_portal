import { ArrowUpRight, CalendarDays, CircleHelp, Search } from 'lucide-react';
import s from './ComprobanteConstanciaAnualizada.module.css';
import { useState, type ChangeEvent } from 'react';


export default function ComprobanteConstanciaAnualizada() {
    const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'] as const;

    const [anio, setAnio] = useState('2026');
    const [concepto, setConcepto] = useState('');
    
    const handleAnioChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setAnio(event.target.value);
    };

    const handleConceptoChange = (event: ChangeEvent<HTMLInputElement>) => {
        setConcepto(sanitizeConcept(event.target.value));
      };

      function sanitizeConcept(value: string) {
      return value.replace(/\D/g, '').slice(0, 4);
}

    return (
    <div className={s.box}>

    <div className={s.wrap}>
    

        <span className={s.text}>Seleccione el Año</span>

        <div className={s.input}>
        <span className={s.controlIcon} aria-hidden="true">
            <CalendarDays size={18} />
        </span>

              <select
                className={s.control}
                value={anio}
                onChange={handleAnioChange}
              >
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
        </div>

    </div>


    <div className={s.infoCard}>
          <div className={s.infoBadge} aria-hidden="true">
            <CircleHelp size={16} />
          </div>

          <div className={s.infoCopy}>
            <h3 className={s.infoTitle}>
              Aclaración de conceptos de percepciones y deducciones
            </h3>

            <p className={s.infoText}>
              Captura los 4 dígitos del concepto que deseas consultar.
            </p>
          </div>
        

        <div className={s.infoBody}>
          <label className={s.field}>
            <span className={s.label}>Concepto a consultar</span>

            <div className={s.searchWrap}>
              <span className={s.searchIcon} aria-hidden="true">
                <Search size={18} />
              </span>

              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                className={s.searchInput}
                placeholder="Ej. 1024"
                value={concepto}
                onChange={handleConceptoChange}
              />

              <span className={s.inlineCounter}>{concepto.length}/4</span>
            </div>

            <span className={s.helper}>Ingresa únicamente números.</span>
          </label>
        </div>
        </div>
                
        <button
          type="button"
          className={s.primaryBtn}
                
        >
          <span className={s.primaryBtnText}>Consultar constancia</span>

          <span className={s.primaryBtnIcon} aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </button>
    </div>
    )
}   