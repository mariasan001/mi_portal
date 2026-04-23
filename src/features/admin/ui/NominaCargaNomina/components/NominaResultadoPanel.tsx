

import { FileText, Hash } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { EjecucionPayrollStagingDto } from '../../../types/nomina-staging.types';

import s from './NominaResultadoPanel.module.css';

type Props = {
  detalle: EjecucionPayrollStagingDto;
};

/**
 * Variantes simples para entrada escalonada de tarjetas.
 */
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NominaResultadoPanel({ detalle }: Props) {
  /**
   * Accesibilidad:
   * si el usuario prefiere menos movimiento,
   * evitamos animaciones innecesarias.
   */
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
   
      <motion.dl
        className={s.grid}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'show'}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.04,
            },
          },
        }}
      >
        <motion.div
          className={s.item}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>Execution ID</dt>
          </div>

          <dd>{detalle.executionId}</dd>
        </motion.div>

        <motion.div
          className={s.item}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>File ID</dt>
          </div>

          <dd>{detalle.fileId}</dd>
        </motion.div>

        <motion.div
          className={s.item}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FileText size={15} />
            </div>
            <dt>Proceso</dt>
          </div>

          <dd className={s.compactValue}>{detalle.jobName}</dd>
        </motion.div>
      </motion.dl>
    </motion.section>
  );
}
