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
   */
  const [requestId, setRequestId] = useState('');

  /**
   * Actualiza cualquier campo del formulario.
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
   * Abre el modal.
   */
  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  /**
   * Cierra el modal.
   */
  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  /**
   * Limpia el formulario.
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
   * Consulta el listado según el filtro actual.
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
   * Selecciona una solicitud y carga:
   * - detalle operativo
   * - detalle técnico
   */
  const handleSelectRequest = useCallback(
    async (selectedRequestId: string) => {
      setRequestId(selectedRequestId);

      /**
       * Logs temporales de depuración:
       * confirman qué requestId se seleccionó realmente.
       */
      console.log('Firma seleccionada:', selectedRequestId);

      try {
        await Promise.all([
          domain.consultarDetalle(selectedRequestId),
          domain.consultarDetalleTecnico(selectedRequestId),
        ]);

        /**
         * Log temporal para validar qué quedó cargado
         * en memoria después de consultar.
         */
        console.log('Detalle operativo solicitado para:', selectedRequestId);
        console.log('Detalle técnico solicitado para:', selectedRequestId);
      } catch {
        toast.error('No se pudo cargar el detalle de la solicitud.');
      }
    },
    [domain]
  );

  /**
   * Consulta manual del detalle operativo.
   */
  const handleLoadDetail = useCallback(async () => {
    const id = requestId.trim();

    if (!id) {
      toast.error('Debes capturar un Request ID válido.');
      return;
    }

    try {
      console.log('Consulta manual detalle:', id);

      await domain.consultarDetalle(id);
      toast.success('Detalle consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el detalle.');
    }
  }, [domain, requestId]);

  /**
   * Consulta manual del detalle técnico.
   */
  const handleLoadTechnicalDetail = useCallback(async () => {
    const id = requestId.trim();

    if (!id) {
      toast.error('Debes capturar un Request ID válido.');
      return;
    }

    try {
      console.log('Consulta manual detalle técnico:', id);

      await domain.consultarDetalleTecnico(id);
      toast.success('Detalle técnico consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el detalle técnico.');
    }
  }, [domain, requestId]);

  /**
   * Crea una nueva solicitud.
   */
  const handleCreate = useCallback(async () => {
    if (!createPayload) {
      toast.error('Debes capturar archivo, CUTS y contraseña.');
      return;
    }

    try {
      const response = await domain.ejecutarCreacion(createPayload);

      /**
       * Como el dominio ya regresa DTO limpio,
       * aquí usamos response.requestId
       * y no response.data.requestId
       */
      const nuevoRequestId = response.requestId;

      console.log('Nueva solicitud creada:', nuevoRequestId);

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
    isCreateModalOpen,
    requestId,
    statusFilter,
    createForm,
    updateCreateField,
    canCreate,
    setRequestId,
    setStatusFilter,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCreate,
    handleLoadList,
    handleSelectRequest,
    handleLoadDetail,
    handleLoadTechnicalDetail,
    creacion: domain.creacion,
    listado: domain.listado,
    detalle: domain.detalle,
    detalleTecnico: domain.detalleTecnico,
  };
}