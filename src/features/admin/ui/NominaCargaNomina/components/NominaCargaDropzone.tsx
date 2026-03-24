import { FileArchive, UploadCloud } from 'lucide-react';

import s from './NominaCargaDropzone.module.css';

type Props = {
  file: File | null;
  onSelectFile: (file: File | null) => void;
};

export default function NominaCargaDropzone({ file, onSelectFile }: Props) {
  return (
    <label className={s.dropzone}>
      <input
        className={s.input}
        type="file"
        accept=".dbf"
        onChange={(e) => {
          const selected = e.target.files?.[0] ?? null;
          onSelectFile(selected);
        }}
      />

      <div className={s.iconWrap}>
        {file ? <FileArchive size={20} /> : <UploadCloud size={20} />}
      </div>

      <div className={s.copy}>
        <h4>{file ? file.name : 'Selecciona un archivo DBF'}</h4>
        <p>
          {file
            ? 'Archivo listo para iniciar la carga.'
            : 'Haz clic para seleccionar el archivo que deseas procesar.'}
        </p>
      </div>
    </label>
  );
}