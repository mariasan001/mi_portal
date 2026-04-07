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

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <div className={s.header}>
          <div>
            <h3>Nueva solicitud de firma</h3>
            <p>Carga el archivo y registra la solicitud de firma electrónica.</p>
          </div>

          <button type="button" className={s.closeBtn} onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className={s.form}>
          <div className={s.field}>
            <label htmlFor="firma-file">Archivo</label>
            <input
              id="firma-file"
              type="file"
              onChange={(e) => onChangeFile(e.target.files?.[0] ?? null)}
            />
            <small>{file ? file.name : 'Sin archivo seleccionado'}</small>
          </div>

          <div className={s.field}>
            <label htmlFor="firma-cuts">CUTS</label>
            <input
              id="firma-cuts"
              type="text"
              value={cuts}
              onChange={(e) => onChangeCuts(e.target.value)}
              placeholder="Ej. LASC960825HMCRNS00"
            />
          </div>

          <div className={s.field}>
            <label htmlFor="firma-contrasena">Contraseña</label>
            <input
              id="firma-contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => onChangeContrasena(e.target.value)}
              placeholder="Contraseña de firma"
            />
          </div>

          <div className={s.field}>
            <label htmlFor="firma-nombre">Nombre</label>
            <input
              id="firma-nombre"
              type="text"
              value={nombre}
              onChange={(e) => onChangeNombre(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className={`${s.field} ${s.full}`}>
            <label htmlFor="firma-descripcion">Descripción</label>
            <textarea
              id="firma-descripcion"
              rows={4}
              value={descripcion}
              onChange={(e) => onChangeDescripcion(e.target.value)}
              placeholder="Opcional"
            />
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