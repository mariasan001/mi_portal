import {
  CalendarDays,
  FileArchive,
  FileText,
  FolderCog,
  Hash,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type {
  ArchivoNominaDto,
  EjecucionCatalogoDto,
} from '@/features/admin/nomina/shared/model/catalogo.types';
import {
  formatBytes,
  formatNominaDateTime,
  formatNominaTitle,
} from '../../model/carga.selectors';

import s from './CatalogoResultadoPanel.module.css';

type Props = {
  archivo: ArchivoNominaDto | null;
  ejecucion: EjecucionCatalogoDto | null;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function CatalogoResultadoPanel({
  archivo,
  ejecucion,
}: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      {archivo ? (
        <div className={s.group}>
          <h5 className={s.groupTitle}>Archivo cargado</h5>

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
            <InfoCard label="File ID" icon={<Hash size={15} />}>
              {archivo.fileId}
            </InfoCard>

            <InfoCard label="Versión" icon={<Hash size={15} />}>
              {archivo.versionId}
            </InfoCard>

            <InfoCard label="Tipo de archivo" icon={<FileArchive size={15} />}>
              {formatNominaTitle(archivo.fileType)}
            </InfoCard>

            <InfoCard
              label="Nombre del archivo"
              icon={<FileText size={15} />}
              wide
            >
              {archivo.fileName}
            </InfoCard>

            <InfoCard label="Ruta de almacenamiento" icon={<FolderCog size={15} />} wide>
              {archivo.filePath}
            </InfoCard>

            <InfoCard label="Checksum" icon={<ShieldCheck size={15} />} wide>
              {archivo.checksumSha256}
            </InfoCard>

            <InfoCard label="Tamaño" icon={<HardDrive size={15} />}>
              {formatBytes(archivo.fileSizeBytes)}
            </InfoCard>

            <InfoCard label="Estatus" icon={<ShieldCheck size={15} />}>
              {formatNominaTitle(archivo.status)}
            </InfoCard>

            <InfoCard
              label="Fecha de carga"
              icon={<CalendarDays size={15} />}
              wide
            >
              {formatNominaDateTime(archivo.uploadedAt)}
            </InfoCard>
          </motion.dl>
        </div>
      ) : null}

      {ejecucion ? (
        <div className={s.group}>
          <h5 className={s.groupTitle}>Ejecución generada</h5>

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
              {ejecucion.executionId}
            </InfoCard>

            <InfoCard label="File ID" icon={<Hash size={15} />}>
              {ejecucion.fileId}
            </InfoCard>

            <InfoCard label="Proceso ejecutado" icon={<FolderCog size={15} />}>
              {ejecucion.jobName}
            </InfoCard>
          </motion.dl>
        </div>
      ) : null}
    </motion.section>
  );
}

type InfoCardProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
  wide?: boolean;
};

function InfoCard({ children, icon, label, wide = false }: InfoCardProps) {
  return (
    <motion.div
      className={`${s.item} ${wide ? s.itemWide : ''}`.trim()}
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
