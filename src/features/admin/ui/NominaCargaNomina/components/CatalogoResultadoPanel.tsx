import {
  CalendarDays,
  FileArchive,
  FileText,
  FolderCog,
  Hash,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';

import type {
  ArchivoNominaDto,
  EjecucionCatalogoDto,
} from '../../../types/nomina-catalogo.types';

import s from './CatalogoResultadoPanel.module.css';
import { formatBytes, formatNominaDateTime } from '../utils/nomina-cargas.utils';

type Props = {
  archivo: ArchivoNominaDto | null;
  ejecucion: EjecucionCatalogoDto | null;
};

export default function CatalogoResultadoPanel({ archivo, ejecucion }: Props) {
  return (
    <section className={s.panel}>
      <div className={s.intro}>
        <div className={s.introBadge}>
          <FolderCog size={14} />
          Resultado del catálogo
        </div>

        <div className={s.introCopy}>
          <h4>Detalle del archivo y su ejecución</h4>
          <p>Consulta los datos más recientes del archivo registrado y del job disparado.</p>
        </div>
      </div>

      {archivo ? (
        <div className={s.group}>
          <h5 className={s.groupTitle}>Archivo registrado</h5>

          <dl className={s.grid}>
            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Hash size={15} />
                </div>
                <dt>fileId</dt>
              </div>
              <dd>{archivo.fileId}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Hash size={15} />
                </div>
                <dt>versionId</dt>
              </div>
              <dd>{archivo.versionId}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FileArchive size={15} />
                </div>
                <dt>Tipo</dt>
              </div>
              <dd>{archivo.fileType}</dd>
            </div>

            <div className={`${s.item} ${s.itemWide}`}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FileText size={15} />
                </div>
                <dt>Nombre</dt>
              </div>
              <dd>{archivo.fileName}</dd>
            </div>

            <div className={`${s.item} ${s.itemWide}`}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FolderCog size={15} />
                </div>
                <dt>Ruta</dt>
              </div>
              <dd>{archivo.filePath}</dd>
            </div>

            <div className={`${s.item} ${s.itemWide}`}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <ShieldCheck size={15} />
                </div>
                <dt>Checksum</dt>
              </div>
              <dd>{archivo.checksumSha256}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <HardDrive size={15} />
                </div>
                <dt>Tamaño</dt>
              </div>
              <dd>{formatBytes(archivo.fileSizeBytes)}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <ShieldCheck size={15} />
                </div>
                <dt>Estatus</dt>
              </div>
              <dd>{archivo.status}</dd>
            </div>

            <div className={`${s.item} ${s.itemWide}`}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <CalendarDays size={15} />
                </div>
                <dt>Subido en</dt>
              </div>
              <dd>{formatNominaDateTime(archivo.uploadedAt)}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      {ejecucion ? (
        <div className={s.group}>
          <h5 className={s.groupTitle}>Ejecución del job</h5>

          <dl className={s.grid}>
            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Hash size={15} />
                </div>
                <dt>executionId</dt>
              </div>
              <dd>{ejecucion.executionId}</dd>
            </div>

            <div className={s.item}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <Hash size={15} />
                </div>
                <dt>fileId</dt>
              </div>
              <dd>{ejecucion.fileId}</dd>
            </div>

            <div className={`${s.item} ${s.itemWide}`}>
              <div className={s.itemHead}>
                <div className={s.iconWrap}>
                  <FolderCog size={15} />
                </div>
                <dt>jobName</dt>
              </div>
              <dd>{ejecucion.jobName}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </section>
  );
}