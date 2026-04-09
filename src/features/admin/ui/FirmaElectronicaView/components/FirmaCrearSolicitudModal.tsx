'use client';

import { FileText, LockKeyhole, UserRound, AlignLeft, Upload, X } from 'lucide-react';
import s from './FirmaCrearSolicitudModal.module.css';

type Props = {
  isOpen: boolean;
  file: File | null;
  cuts: string;
  contrasena: string;
  nombre: string;
  descripcion: string;
  loading: boolean;
  canCreate: boolean;
  onClose: () => void;
  onChangeFile: (file: File | null) => void;
  onChangeCuts: (value: string) => void;
  onChangeContrasena: (value: string) => void;
  onChangeNombre: (value: string) => void;
  onChangeDescripcion: (value: string) => void;
  onSubmit: () => void;
};

export default function FirmaCrearSolicitudModal({
  isOpen,
  file,
  cuts,
  contrasena,
  nombre,
  descripcion,
  loading,
  canCreate,
  onClose,
  onChangeFile,
  onChangeCuts,
  onChangeContrasena,
  onChangeNombre,
  onChangeDescripcion,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    onChangeFile(droppedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div
        className={s.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="firma-modal-title"
      >
        <div className={s.header}>
          <div className={s.headerText}>
            <span className={s.kicker}>Firma electrónica</span>
            <h3 id="firma-modal-title">Nueva solicitud de firma</h3>
            <p>Carga el archivo y registra la solicitud de firma electrónica.</p>
          </div>

          <button
            type="button"
            className={s.iconCloseBtn}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className={s.body}>
          <div className={s.form}>
            <div className={`${s.field} ${s.full}`}>
              <label htmlFor="firma-file">Archivo</label>

              <label
                htmlFor="firma-file"
                className={`${s.uploadArea} ${file ? s.uploadAreaFilled : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  id="firma-file"
                  type="file"
                  className={s.hiddenInput}
                  onChange={(e) => onChangeFile(e.target.files?.[0] ?? null)}
                />

                <div className={s.uploadLeft}>
                  <div className={s.uploadIcon}>
                    <Upload size={16} />
                  </div>

                  <div className={s.uploadText}>
                    <span className={s.uploadTitle}>
                      {file ? file.name : 'Arrastra un archivo aquí o selecciónalo'}
                    </span>
                    <span className={s.uploadHint}>
                      {file ? 'Archivo listo para enviarse.' : 'Selecciona el documento a firmar.'}
                    </span>
                  </div>
                </div>

                <span className={s.uploadButton}>
                  {file ? 'Cambiar archivo' : 'Seleccionar'}
                </span>
              </label>
            </div>

            <div className={s.field}>
              <label htmlFor="firma-cuts">CUTS</label>
              <div className={s.inputWrap}>
                <FileText size={15} />
                <input
                  id="firma-cuts"
                  type="text"
                  value={cuts}
                  onChange={(e) => onChangeCuts(e.target.value)}
                  placeholder="Ej. LASC960825HMCRNS00"
                />
              </div>
            </div>

            <div className={s.field}>
              <label htmlFor="firma-contrasena">Contraseña</label>
              <div className={s.inputWrap}>
                <LockKeyhole size={15} />
                <input
                  id="firma-contrasena"
                  type="password"
                  value={contrasena}
                  onChange={(e) => onChangeContrasena(e.target.value)}
                  placeholder="Contraseña de firma"
                />
              </div>
            </div>

            <div className={s.field}>
              <label htmlFor="firma-nombre">Nombre</label>
              <div className={s.inputWrap}>
                <UserRound size={15} />
                <input
                  id="firma-nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => onChangeNombre(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className={s.field}>
              <label htmlFor="firma-descripcion-breve">Descripción breve</label>
              <div className={s.inputWrap}>
                <AlignLeft size={15} />
                <input
                  id="firma-descripcion-breve"
                  type="text"
                  placeholder="Opcional"
                  value=""
                  readOnly
                />
              </div>
            </div>

            <div className={`${s.field} ${s.full}`}>
              <label htmlFor="firma-descripcion">Descripción</label>
              <textarea
                id="firma-descripcion"
                rows={5}
                value={descripcion}
                onChange={(e) => onChangeDescripcion(e.target.value)}
                placeholder="Agrega contexto adicional para identificar mejor esta solicitud."
              />
            </div>
          </div>
        </div>

        <div className={s.footer}>
          <button type="button" className={s.secondaryBtn} onClick={onClose}>
            Cancelar
          </button>

          <button
            type="button"
            className={s.primaryBtn}
            onClick={onSubmit}
            disabled={!canCreate || loading}
          >
            {loading ? 'Creando...' : 'Crear solicitud'}
          </button>
        </div>
      </div>
    </div>
  );
}