'use client';

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
} from '../../../types/nomina-catalogo.types';

import s from './CatalogoResultadoPanel.module.css';
import {
  formatBytes,
  formatNominaDateTime,
  
} from '../utils/nomina-cargas.utils';
import { formatNominaTitle } from '../../NominaConfiguracion/utils/nomina-configuracion_tex.utils';

type Props = {
  archivo: ArchivoNominaDto | null;
  ejecucion: EjecucionCatalogoDto | null;
};

/**
 * Variantes simples para entrada escalonada de las tarjetas.
 */
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function CatalogoResultadoPanel({
  archivo,
  ejecucion,
}: Props) {
  /**
   * Accesibilidad:
   * si el usuario prefiere menos movimiento,
   * reducimos o eliminamos animaciones.
   */
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
          <h5 className={s.groupTitle}>Archivo</h5>

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
                <dt>File ID</dt>
              </div>

              <dd>{archivo.fileId}</dd>
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
                <dt>Versión ID</dt>
              </div>

              <dd>{archivo.versionId}</dd>
            </motion.div>

            <motion.div
              className={s.item}
              variants={itemVariants}
              transition={{ duration: 0.2 }}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FileArchive size={15} />
                </div>
                <dt>Tipo</dt>
              </div>

              <dd>{formatNominaTitle(archivo.fileType)}</dd>
            </motion.div>

            <motion.div
              className={`${s.item} ${s.itemWide}`}
              variants={itemVariants}
              transition={{ duration: 0.2 }}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FileText size={15} />
                </div>
                <dt>Nombre del archivo</dt>
              </div>

              <dd>{archivo.fileName}</dd>
            </motion.div>

            <motion.div
              className={`${s.item} ${s.itemWide}`}
              variants={itemVariants}
              transition={{ duration: 0.2 }}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FolderCog size={15} />
                </div>
                <dt>Ruta</dt>
              </div>

              <dd>{archivo.filePath}</dd>
            </motion.div>

            <motion.div
              className={`${s.item} ${s.itemWide}`}
              variants={itemVariants}
              transition={{ duration: 0.2 }}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <ShieldCheck size={15} />
                </div>
                <dt>Checksum</dt>
              </div>

              <dd>{archivo.checksumSha256}</dd>
            </motion.div>

            <motion.div
              className={s.item}
              variants={itemVariants}
              transition={{ duration: 0.2 }}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <HardDrive size={15} />
                </div>
                <dt>Tamaño</dt>
              </div>

              <dd>{formatBytes(archivo.fileSizeBytes)}</dd>
            </motion.div>

            <motion.div
              className={s.item}
              variants={itemVariants}
              transition={{ duration: 0.2 }}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <ShieldCheck size={15} />
                </div>
                <dt>Estatus</dt>
              </div>

              <dd>{formatNominaTitle(archivo.status)}</dd>
            </motion.div>

            <motion.div
              className={`${s.item} ${s.itemWide}`}
              variants={itemVariants}
              transition={{ duration: 0.2 }}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <CalendarDays size={15} />
                </div>
                <dt>Fecha de carga</dt>
              </div>

              <dd>{formatNominaDateTime(archivo.uploadedAt)}</dd>
            </motion.div>
          </motion.dl>
        </div>
      ) : null}

      {ejecucion ? (
        <div className={s.group}>
          <h5 className={s.groupTitle}>Ejecución</h5>

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

              <dd>{ejecucion.executionId}</dd>
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

              <dd>{ejecucion.fileId}</dd>
            </motion.div>

            <motion.div
              className={s.item}
              variants={itemVariants}
              transition={{ duration: 0.2 }}
            >
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FolderCog size={15} />
                </div>
                <dt>Proceso</dt>
              </div>

              <dd className={s.compactValue}>{ejecucion.jobName}</dd>
            </motion.div>
          </motion.dl>
        </div>
      ) : null}
    </motion.section>
  );
}