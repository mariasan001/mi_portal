'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useNominaFirmaElectronica } from '../../../hooks/useNominaFirmaElectronica';
import type {
  CrearSolicitudFirmaPayload,
  SignatureRequestStatus,
} from '../../../types/firma-electronica.types';
import type { FirmaCreateFormState } from '../types/firma-electronica-view.types';

export function useFirmaElectronicaView() {
  /**
   * Hook de dominio:
   * aquí vive la conexión real con services/API.
   */
  const domain = useNominaFirmaElectronica();

  /**
   * Estado del modal de creación.
   */
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  /**
   * Formulario visual para crear una nueva solicitud.
   */
  const [createForm, setCreateForm] = useState<FirmaCreateFormState>({
    file: null,
    cuts: '',
    contrasena: '',
    nombre: '',
    descripcion: '',
  });

  /**
   * Filtro visual del listado por estatus.
   */
  const [statusFilter, setStatusFilter] = useState<
    SignatureRequestStatus | ''
  >('');

  /**
   * Request ID actualmente seleccionado.
   * Se usa para:
   * - resaltar fila en tabla
   * - cargar detalle
   * - cargar detalle técnico
   */
  const [requestId, setRequestId] = useState('');

  /**
   * Actualiza cualquier campo del formulario de creación.
   */
  const updateCreateField = useCallback(
    <K extends keyof FirmaCreateFormState>(
      key: K,
      value: FirmaCreateFormState[K]
    ) => {
      setCreateForm((current) => ({
        ...current,
        [key]: value,
      }));
    },
    []
  );

  /**
   * Determina si ya se puede crear la solicitud.
   * Campos obligatorios según API:
   * - file
   * - cuts
   * - contrasena
   */
  const canCreate = useMemo(() => {
    return Boolean(
      createForm.file &&
        createForm.cuts.trim() &&
        createForm.contrasena.trim()
    );
  }, [createForm]);

  /**
   * Payload listo para enviar al dominio.
   * Si faltan datos obligatorios, regresa null.
   */
  const createPayload = useMemo<CrearSolicitudFirmaPayload | null>(() => {
    if (
      !createForm.file ||
      !createForm.cuts.trim() ||
      !createForm.contrasena.trim()
    ) {
      return null;
    }

    return {
      file: createForm.file,
      cuts: createForm.cuts.trim(),
      contrasena: createForm.contrasena.trim(),
      nombre: createForm.nombre.trim() || undefined,
      descripcion: createForm.descripcion.trim() || undefined,
    };
  }, [createForm]);

  /**
   * Abre el modal de creación.
   */
  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  /**
   * Cierra el modal de creación.
   */
  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  /**
   * Limpia el formulario después de una creación exitosa.
   */
  const resetCreateForm = useCallback(() => {
    setCreateForm({
      file: null,
      cuts: '',
      contrasena: '',
      nombre: '',
      descripcion: '',
    });
  }, []);

  /**
   * Consulta el listado según el estatus seleccionado.
   */
  const handleLoadList = useCallback(async () => {
    try {
      await domain.consultarListado(statusFilter || undefined);
      toast.success('Listado consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el listado.');
    }
  }, [domain, statusFilter]);

  /**
   * Selecciona una solicitud desde la tabla y carga:
   * - detalle operativo
   * - detalle técnico
   */
  const handleSelectRequest = useCallback(
    async (selectedRequestId: string) => {
      setRequestId(selectedRequestId);

      try {
        await Promise.all([
          domain.consultarDetalle(selectedRequestId),
          domain.consultarDetalleTecnico(selectedRequestId),
        ]);
      } catch {
        toast.error('No se pudo cargar el detalle de la solicitud.');
      }
    },
    [domain]
  );

  /**
   * Consulta manual del detalle operativo usando el requestId actual.
   * Útil si en algún momento agregas un input de consulta manual.
   */
  const handleLoadDetail = useCallback(async () => {
    const id = requestId.trim();

    if (!id) {
      toast.error('Debes capturar un Request ID válido.');
      return;
    }

    try {
      await domain.consultarDetalle(id);
      toast.success('Detalle consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el detalle.');
    }
  }, [domain, requestId]);

  /**
   * Consulta manual del detalle técnico usando el requestId actual.
   */
  const handleLoadTechnicalDetail = useCallback(async () => {
    const id = requestId.trim();

    if (!id) {
      toast.error('Debes capturar un Request ID válido.');
      return;
    }

    try {
      await domain.consultarDetalleTecnico(id);
      toast.success('Detalle técnico consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el detalle técnico.');
    }
  }, [domain, requestId]);

  /**
   * Crea una nueva solicitud de firma.
   *
   * Flujo al crear:
   * 1. valida datos
   * 2. crea solicitud
   * 3. guarda requestId nuevo
   * 4. refresca listado
   * 5. carga detalle y detalle técnico
   * 6. cierra modal
   * 7. limpia formulario
   */
  const handleCreate = useCallback(async () => {
    if (!createPayload) {
      toast.error('Debes capturar archivo, CUTS y contraseña.');
      return;
    }

    try {
      const response = await domain.ejecutarCreacion(createPayload);

      const nuevoRequestId = response.data.requestId;

      setRequestId(nuevoRequestId);

      await Promise.all([
        domain.consultarListado(statusFilter || undefined),
        domain.consultarDetalle(nuevoRequestId),
        domain.consultarDetalleTecnico(nuevoRequestId),
      ]);

      setIsCreateModalOpen(false);
      resetCreateForm();

      toast.success('Solicitud de firma creada correctamente.');
    } catch {
      toast.error('No se pudo crear la solicitud de firma.');
    }
  }, [createPayload, domain, resetCreateForm, statusFilter]);

  return {
    /**
     * Estado visual general
     */
    isCreateModalOpen,
    requestId,
    statusFilter,

    /**
     * Formulario visual
     */
    createForm,
    updateCreateField,
    canCreate,

    /**
     * Setters visuales
     */
    setRequestId,
    setStatusFilter,

    /**
     * Acciones UI
     */
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCreate,
    handleLoadList,
    handleSelectRequest,
    handleLoadDetail,
    handleLoadTechnicalDetail,

    /**
     * Estado proveniente del dominio
     */
    creacion: domain.creacion,
    listado: domain.listado,
    detalle: domain.detalle,
    detalleTecnico: domain.detalleTecnico,
  };
}