import { FileArchive, UploadCloud } from 'lucide-react';

import s from './NominaCargaDropzone.module.css';

type Props = {
  files: File[];
  multiple?: boolean;
  onSelectFiles: (files: File[]) => void;
};

export default function NominaCargaDropzone({
  files,
  multiple = false,
  onSelectFiles,
}: Props) {
  const hasFiles = files.length > 0;
  const primaryFile = files[0];
  const visibleFiles = files.slice(0, 5);

  return (
    <label className={s.dropzone}>
      <input
        className={s.input}
        type="file"
        accept=".dbf"
        multiple={multiple}
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? []);
          onSelectFiles(selected);
        }}
      />

      <div className={s.iconWrap}>
        {hasFiles ? <FileArchive size={20} /> : <UploadCloud size={20} />}
      </div>

      <div className={s.copy}>
        <h4>
          {hasFiles
            ? multiple
              ? `${files.length} archivo${files.length === 1 ? '' : 's'} seleccionado${files.length === 1 ? '' : 's'}`
              : primaryFile?.name
            : multiple
              ? 'Selecciona uno o varios archivos DBF'
              : 'Selecciona un archivo DBF'}
        </h4>
        <p>
          {hasFiles
            ? multiple
              ? 'Puedes dejarlos cargados o procesarlos en cola, uno por uno.'
              : 'Archivo listo para iniciar la carga.'
            : multiple
              ? 'Haz clic para elegir varios archivos para esta versión.'
              : 'Haz clic para seleccionar el archivo que deseas procesar.'}
        </p>
      </div>

      {multiple && hasFiles ? (
        <div className={s.filePanel}>
          <div className={s.filePanelHead}>
            <strong>{files.length} en cola</strong>
            <span>Orden actual de carga</span>
          </div>

          <ul className={s.fileList}>
            {visibleFiles.map((file, index) => (
              <li key={`${file.name}-${file.size}`}>
                <span className={s.fileIndex}>{index + 1}</span>
                <span className={s.fileName}>{file.name}</span>
              </li>
            ))}
          </ul>

          {files.length > visibleFiles.length ? (
            <span className={s.fileMore}>+{files.length - visibleFiles.length} archivo(s) más</span>
          ) : null}
        </div>
      ) : null}
    </label>
  );
}
