'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  CalendarRange,
  CircleHelp,
  Search,
} from 'lucide-react';

import s from './ComprobanteQuincenalForm.module.css';

/**
 * Formulario del módulo "Comprobante quincenal".
 *
 * Importante:
 * - Ya no renderiza una tarjeta externa completa.
 * - Ahora vive dentro del panel expandido del workspace.
 * - Así evitamos duplicar cajas, títulos y bordes.
 */
export default function ComprobanteQuincenalForm() {
  const [quincena, setQuincena] = useState('');
  const [anio, setAnio] = useState('2026');
  const [concepto, setConcepto] = useState('');

  /**
   * Limpia el input para aceptar solo números
   * y limitarlo a 4 dígitos.
   */
  const conceptoLimpio = useMemo(
    () => concepto.replace(/\D/g, '').slice(0, 4),
    [concepto]
  );

  return (
    <div className={s.formShell}>
      <div className={s.topFields}>
        <label className={s.field}>
          <span className={s.label}>Quincena</span>

          <div className={s.controlWrap}>
            <span className={s.controlIcon} aria-hidden="true">
              <CalendarRange size={18} />
            </span>

            <select
              className={s.control}
              value={quincena}
              onChange={(event) => setQuincena(event.target.value)}
            >
              <option value="">Selecciona la quincena</option>
              <option value="01">01</option>
              <option value="02">02</option>
              <option value="03">03</option>
              <option value="04">04</option>
              <option value="05">05</option>
              <option value="06">06</option>
              <option value="07">07</option>
              <option value="08">08</option>
              <option value="09">09</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
            </select>
          </div>
        </label>

        <label className={s.field}>
          <span className={s.label}>Año</span>

          <div className={s.controlWrap}>
            <span className={s.controlIcon} aria-hidden="true">
              <CalendarDays size={18} />
            </span>

            <select
              className={s.control}
              value={anio}
              onChange={(event) => setAnio(event.target.value)}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </label>
      </div>

      <section className={s.infoCard} aria-label="Aclaración de conceptos">
        <div className={s.infoHead}>
          <div className={s.infoIcon} aria-hidden="true">
            <CircleHelp size={18} />
          </div>

          <div className={s.infoCopy}>
            <h3 className={s.infoTitle}>
              Aclaración de conceptos de percepciones y deducciones
            </h3>

            <p className={s.infoText}>
              Captura los <strong>4 dígitos</strong> del concepto que deseas
              consultar para facilitar la búsqueda y revisión de la información.
            </p>
          </div>
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
                value={conceptoLimpio}
                onChange={(event) => setConcepto(event.target.value)}
              />
            </div>

            <span className={s.helper}>
              Ingresa únicamente números. Deben ser exactamente cuatro dígitos.
            </span>
          </label>
        </div>
      </section>

      <div className={s.actions}>
        <button type="button" className={s.primaryBtn}>
          <span className={s.primaryBtnText}>Consultar comprobante</span>

          <span className={s.primaryBtnIcon} aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </button>
      </div>
    </div>
  );
}