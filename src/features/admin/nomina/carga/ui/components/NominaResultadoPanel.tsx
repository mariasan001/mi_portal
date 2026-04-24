import { FileText, Hash } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { EjecucionPayrollStagingDto } from '@/features/admin/nomina/shared/model/staging.types';

import s from './NominaResultadoPanel.module.css';

type Props = {
  detalle: EjecucionPayrollStagingDto;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NominaResultadoPanel({ detalle }: Props) {
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
        <InfoCard label="Execution ID" icon={<Hash size={15} />}>
          {detalle.executionId}
        </InfoCard>

        <InfoCard label="File ID" icon={<Hash size={15} />}>
          {detalle.fileId}
        </InfoCard>

        <InfoCard label="Proceso ejecutado" icon={<FileText size={15} />}>
          {detalle.jobName}
        </InfoCard>
      </motion.dl>
    </motion.section>
  );
}

type InfoCardProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
};

function InfoCard({ children, icon, label }: InfoCardProps) {
  return (
    <motion.div
      className={s.item}
      variants={itemVariants}
      transition={{ duration: 0.2 }}
    >
      <div className={s.itemHead}>
        <div className={s.iconWrap}>{icon}</div>
        <dt>{label}</dt>
      </div>

      <dd
        className={
          typeof children === 'string' && children.length > 48
            ? s.compactValue
            : undefined
        }
      >
        {children}
      </dd>
    </motion.div>
  );
}
