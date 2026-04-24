'use client';

import { type ChangeEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CalendarDays,
  CalendarRange,
  CircleHelp,
  Search,
} from 'lucide-react';

import s from './ComprobanteQuincenalForm.module.css';

const QUINCENA_OPTIONS = Array.from({ length: 24 }, (_, index) =>
  String(index + 1).padStart(2, '0')
);

const YEAR_OPTIONS = ['2026', '2025', '2024'] as const;

const rootVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
};

const blockVariants = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: 'blur(4px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    filter: 'blur(3px)',
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

function sanitizeConcept(value: string) {
  return value.replace(/\D/g, '').slice(0, 4);
}

export default function ComprobanteQuincenalForm() {
  const [quincena, setQuincena] = useState('');
  const [anio, setAnio] = useState('2026');
  const [concepto, setConcepto] = useState('');

  const isSubmitDisabled = useMemo(() => {
    return !quincena || !anio || concepto.length !== 4;
  }, [quincena, anio, concepto]);

  const handleQuincenaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setQuincena(event.target.value);
  };

  const handleAnioChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setAnio(event.target.value);
  };

  const handleConceptoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConcepto(sanitizeConcept(event.target.value));
  };

  const handleConsultar = () => {
    if (isSubmitDisabled) return;

    console.log('Consultar comprobante con:', {
      quincena,
      anio,
      concepto,
    });
  };

  return (
    <motion.div
      className={s.formShell}
      variants={rootVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <motion.section className={s.section} variants={blockVariants}>
        <div className={s.sectionHead}>
          <div>
            <h3 className={s.sectionTitle}>Periodo de consulta</h3>
            <p className={s.sectionText}>
              Selecciona la quincena y el ano correspondientes.
            </p>
          </div>
        </div>

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
                onChange={handleQuincenaChange}
              >
                <option value="">Selecciona la quincena</option>

                {QUINCENA_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className={s.field}>
            <span className={s.label}>Ano</span>

            <div className={s.controlWrap}>
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
          </label>
        </div>
      </motion.section>

      <motion.section
        className={s.infoCard}
        aria-label="Aclaracion de conceptos"
        variants={blockVariants}
      >
        <div className={s.infoHead}>
          <div className={s.infoBadge} aria-hidden="true">
            <CircleHelp size={16} />
          </div>

          <div className={s.infoCopy}>
            <h3 className={s.infoTitle}>
              Aclaracion de conceptos de percepciones y deducciones
            </h3>

            <p className={s.infoText}>
              Captura los 4 digitos del concepto que deseas consultar.
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
                value={concepto}
                onChange={handleConceptoChange}
              />

              <span className={s.inlineCounter}>{concepto.length}/4</span>
            </div>

            <span className={s.helper}>Ingresa unicamente numeros.</span>
          </label>
        </div>
      </motion.section>

      <motion.div className={s.actions} variants={blockVariants}>
        <button
          type="button"
          className={s.primaryBtn}
          onClick={handleConsultar}
          disabled={isSubmitDisabled}
        >
          <span className={s.primaryBtnText}>Consultar comprobante</span>

          <span className={s.primaryBtnIcon} aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
