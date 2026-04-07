type Props = {
  file: File | null;
  cuts: string;
  contrasena: string;
  nombre: string;
  descripcion: string;
  loading: boolean;
  canCreate: boolean;
  onChangeFile: (file: File | null) => void;
  onChangeCuts: (value: string) => void;
  onChangeContrasena: (value: string) => void;
  onChangeNombre: (value: string) => void;
  onChangeDescripcion: (value: string) => void;
  onSubmit: () => void;
};

export default function FirmaCrearSolicitudPanel({
  file,
  cuts,
  contrasena,
  nombre,
  descripcion,
  loading,
  canCreate,
  onChangeFile,
  onChangeCuts,
  onChangeContrasena,
  onChangeNombre,
  onChangeDescripcion,
  onSubmit,
}: Props) {
  return (
    <section>
      <h2>Crear solicitud de firma</h2>
      <p>
        Carga el archivo y envía la solicitud usando CUTS y contraseña del firmante.
      </p>

      <div>
        <label htmlFor="firma-file">Archivo</label>
        <input
          id="firma-file"
          type="file"
          onChange={(e) => onChangeFile(e.target.files?.[0] ?? null)}
        />
        <small>{file ? file.name : 'Sin archivo seleccionado'}</small>
      </div>

      <div>
        <label htmlFor="firma-cuts">CUTS</label>
        <input
          id="firma-cuts"
          type="text"
          value={cuts}
          onChange={(e) => onChangeCuts(e.target.value)}
          placeholder="Ej. LASC960825HMCRNS00"
        />
      </div>

      <div>
        <label htmlFor="firma-contrasena">Contraseña</label>
        <input
          id="firma-contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => onChangeContrasena(e.target.value)}
          placeholder="Contraseña de firma"
        />
      </div>

      <div>
        <label htmlFor="firma-nombre">Nombre</label>
        <input
          id="firma-nombre"
          type="text"
          value={nombre}
          onChange={(e) => onChangeNombre(e.target.value)}
          placeholder="Opcional"
        />
      </div>

      <div>
        <label htmlFor="firma-descripcion">Descripción</label>
        <textarea
          id="firma-descripcion"
          rows={4}
          value={descripcion}
          onChange={(e) => onChangeDescripcion(e.target.value)}
          placeholder="Opcional"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canCreate || loading}
      >
        {loading ? 'Creando...' : 'Crear solicitud'}
      </button>
    </section>
  );
}