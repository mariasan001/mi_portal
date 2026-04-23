

import { CalendarRange, Layers3 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import s from './NominaEntityCards.module.css';
import { NominaEntity } from '../types/nomina-configuracion.types';

type Props = {
  activeEntity: NominaEntity;
  onSelect: (entity: NominaEntity) => void;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NominaEntityCards({ activeEntity, onSelect }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.grid}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'show'}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.06,
          },
        },
      }}
    >
      <motion.button
        type="button"
        className={`${s.card} ${
          activeEntity === 'periodo' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('periodo')}
        variants={itemVariants}
        transition={{ duration: 0.24 }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : { y: -2, transition: { duration: 0.16 } }
        }
        whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
        layout
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <CalendarRange size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Periodos</h2>

            {activeEntity === 'periodo' ? (
              <motion.span
                className={s.stateBadge}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
              >
                Activo
              </motion.span>
            ) : null}
          </div>

          <p>
            Consulta periodos existentes y registra nuevos periodos de pago con
            sus fechas clave.
          </p>
        </div>
      </motion.button>

      <motion.button
        type="button"
        className={`${s.card} ${
          activeEntity === 'version' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('version')}
        variants={itemVariants}
        transition={{ duration: 0.24 }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : { y: -2, transition: { duration: 0.16 } }
        }
        whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
        layout
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <Layers3 size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Versiones</h2>

            {activeEntity === 'version' ? (
              <motion.span
                className={s.stateBadge}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
              >
                Activo
              </motion.span>
            ) : null}
          </div>

          <p>
            Consulta versiones por ID y crea una nueva versión asociada al
            periodo y etapa correspondiente.
          </p>
        </div>
      </motion.button>
    </motion.section>
  );
}