'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useNominaFirmaElectronica } from '../../../hooks/useNominaFirmaElectronica';
import { descargarPdfFirmado } from '../../../services/firma-electronica.service';
import type {
  CrearSolicitudFirmaPayload,
  FirmaDetalleTecnicoDto,
  SignatureRequestStatus,
  SolicitudFirmaDetalleDto,
} from '../../../types/firma-electronica.types';
import type { FirmaCreateFormState } from '../types/firma-electronica-view.types';
import { buildSignedPdfWithTechnicalAppendix } from '../utils/buildSignedPdfWithTechnicalAppendix';

function normalizeStatus(status?: string | null): string {
  return status?.trim() ?? '';
}

function buildSignedPdfFileName(
  documentName?: string | null,
  originalFileName?: string | null
): string {
  const baseName =
    documentName?.trim() || originalFileName?.trim() || 'documento_firmado';

  return `${baseName.replace(/\.pdf$/i, '')}_con_detalle_tecnico.pdf`;
}

function toPdfBlob(bytes: Uint8Array): Blob {
  const safeBytes = new Uint8Array(bytes);

  return new Blob([safeBytes.buffer], {
    type: 'application/pdf',
  });
}

type BuildSignedPdfInput = {
  requestId: string;
  detalle: SolicitudFirmaDetalleDto | null;
  detalleTecnico: FirmaDetalleTecnicoDto | null;
};

export function useFirmaElectronicaView() {
  const {
    consultarListado,
    consultarDetalle,
    consultarDetalleTecnico,
    ejecutarCreacion,
    creacion,
    listado,
    detalle,
    detalleTecnico,
  } = useNominaFirmaElectronica();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [createForm, setCreateForm] = useState<FirmaCreateFormState>({
    file: null,
    cuts: '',
    contrasena: '',
    nombre: '',
    descripcion: '',
  });

  const [statusFilter, setStatusFilter] = useState<
    SignatureRequestStatus | ''
  >('');

  const [requestId, setRequestId] = useState('');

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

  const canCreate = useMemo(() => {
    return Boolean(
      createForm.file &&
        createForm.cuts.trim() &&
        createForm.contrasena.trim()
    );
  }, [createForm]);

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

  const selectedStatus = useMemo(() => {
    return normalizeStatus(detalle.data?.status);
  }, [detalle.data?.status]);

  const hasTechnicalDetail = useMemo(() => {
    return Boolean(detalleTecnico.data);
  }, [detalleTecnico.data]);

  const canGenerateSignedPdf = useMemo(() => {
    return (
      Boolean(requestId.trim()) &&
      selectedStatus === 'SIGNED' &&
      hasTechnicalDetail
    );
  }, [requestId, selectedStatus, hasTechnicalDetail]);

  useEffect(() => {
    void consultarListado(statusFilter || undefined);
  }, [consultarListado, statusFilter]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void consultarListado(statusFilter || undefined);
    }, 30000);

    return () => window.clearInterval(interval);
  }, [consultarListado, statusFilter]);

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const resetCreateForm = useCallback(() => {
    setCreateForm({
      file: null,
      cuts: '',
      contrasena: '',
      nombre: '',
      descripcion: '',
    });
  }, []);

  const handleLoadList = useCallback(async () => {
    try {
      await consultarListado(statusFilter || undefined);
      toast.success('Listado consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el listado.');
    }
  }, [consultarListado, statusFilter]);

  const handleSelectRequest = useCallback(
    async (selectedRequestId: string) => {
      setRequestId(selectedRequestId);

      try {
        await Promise.all([
          consultarDetalle(selectedRequestId),
          consultarDetalleTecnico(selectedRequestId),
        ]);
      } catch {
        toast.error('No se pudo cargar el detalle de la solicitud.');
      }
    },
    [consultarDetalle, consultarDetalleTecnico]
  );

  const handleLoadDetail = useCallback(async () => {
    const id = requestId.trim();

    if (!id) {
      toast.error('Debes capturar un Request ID válido.');
      return;
    }

    try {
      await consultarDetalle(id);
      toast.success('Detalle consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el detalle.');
    }
  }, [consultarDetalle, requestId]);

  const handleLoadTechnicalDetail = useCallback(async () => {
    const id = requestId.trim();

    if (!id) {
      toast.error('Debes capturar un Request ID válido.');
      return;
    }

    try {
      await consultarDetalleTecnico(id);
      toast.success('Detalle técnico consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el detalle técnico.');
    }
  }, [consultarDetalleTecnico, requestId]);

  const handleCreate = useCallback(async () => {
    if (!createPayload) {
      toast.error('Debes capturar archivo, CUTS y contraseña.');
      return;
    }

    try {
      const response = await ejecutarCreacion(createPayload);
      const nuevoRequestId = response.requestId;

      setRequestId(nuevoRequestId);

      await Promise.all([
        consultarListado(statusFilter || undefined),
        consultarDetalle(nuevoRequestId),
        consultarDetalleTecnico(nuevoRequestId),
      ]);

      setIsCreateModalOpen(false);
      resetCreateForm();

      toast.success('Solicitud de firma creada correctamente.');
    } catch {
      toast.error('No se pudo crear la solicitud de firma.');
    }
  }, [
    consultarDetalle,
    consultarDetalleTecnico,
    consultarListado,
    createPayload,
    ejecutarCreacion,
    resetCreateForm,
    statusFilter,
  ]);

  const resolvePdfData = useCallback(
    async (selectedRequestId: string): Promise<BuildSignedPdfInput> => {
      const trimmedId = selectedRequestId.trim();

      if (!trimmedId) {
        throw new Error('No hay una solicitud seleccionada.');
      }

      const isCurrentRequest = requestId.trim() === trimmedId;

      const detallePromise: Promise<SolicitudFirmaDetalleDto | null> =
        isCurrentRequest && detalle.data
          ? Promise.resolve(detalle.data)
          : consultarDetalle(trimmedId);

      const detalleTecnicoPromise: Promise<FirmaDetalleTecnicoDto | null> =
        isCurrentRequest && detalleTecnico.data
          ? Promise.resolve(detalleTecnico.data)
          : consultarDetalleTecnico(trimmedId);

      const [resolvedDetalle, resolvedDetalleTecnico] = await Promise.all([
        detallePromise,
        detalleTecnicoPromise,
      ]);

      return {
        requestId: trimmedId,
        detalle: resolvedDetalle,
        detalleTecnico: resolvedDetalleTecnico,
      };
    },
    [
      consultarDetalle,
      consultarDetalleTecnico,
      detalle.data,
      detalleTecnico.data,
      requestId,
    ]
  );

  const generateSignedPdfBlobByRequestId = useCallback(
    async (selectedRequestId: string): Promise<Blob> => {
      const { requestId: resolvedRequestId, detalleTecnico } =
        await resolvePdfData(selectedRequestId);

      if (!detalleTecnico) {
        throw new Error(
          'No hay detalle técnico disponible para generar el PDF.'
        );
      }

      const signedPdfBytes = await descargarPdfFirmado(resolvedRequestId);

      const finalPdfBytes = await buildSignedPdfWithTechnicalAppendix({
        pdfBytes: signedPdfBytes,
        detalleTecnico,
      });

      return toPdfBlob(finalPdfBytes);
    },
    [resolvePdfData]
  );

  const generateSignedPdfBlob = useCallback(async (): Promise<Blob> => {
    const id = requestId.trim();

    if (!id) {
      throw new Error('No hay una solicitud seleccionada.');
    }

    return generateSignedPdfBlobByRequestId(id);
  }, [generateSignedPdfBlobByRequestId, requestId]);

  const handleViewSignedPdfByRequestId = useCallback(
    async (selectedRequestId: string) => {
      try {
        setRequestId(selectedRequestId);

        const blob = await generateSignedPdfBlobByRequestId(selectedRequestId);
        const url = URL.createObjectURL(blob);

        window.open(url, '_blank', 'noopener,noreferrer');

        toast.success('Vista previa del PDF generada correctamente.');
      } catch (error) {
        console.error('Error al visualizar el PDF firmado:', error);

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo abrir la vista previa del PDF.';

        toast.error(message);
      }
    },
    [generateSignedPdfBlobByRequestId]
  );

  const handleDownloadSignedPdfByRequestId = useCallback(
    async (selectedRequestId: string) => {
      try {
        setRequestId(selectedRequestId);

        const { detalle } = await resolvePdfData(selectedRequestId);

        const blob = await generateSignedPdfBlobByRequestId(selectedRequestId);
        const url = URL.createObjectURL(blob);

        const fileName = buildSignedPdfFileName(
          detalle?.documentName,
          detalle?.originalFileName
        );

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        toast.success('PDF firmado generado correctamente.');
      } catch (error) {
        console.error('Error al descargar el PDF firmado:', error);

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo generar el PDF firmado.';

        toast.error(message);
      }
    },
    [generateSignedPdfBlobByRequestId, resolvePdfData]
  );

  const handleViewSignedPdf = useCallback(async () => {
    const id = requestId.trim();

    if (!id) {
      toast.error('Debes seleccionar una solicitud válida.');
      return;
    }

    await handleViewSignedPdfByRequestId(id);
  }, [handleViewSignedPdfByRequestId, requestId]);

  const handleDownloadSignedPdf = useCallback(async () => {
    const id = requestId.trim();

    if (!id) {
      toast.error('Debes seleccionar una solicitud válida.');
      return;
    }

    await handleDownloadSignedPdfByRequestId(id);
  }, [handleDownloadSignedPdfByRequestId, requestId]);

  return {
    isCreateModalOpen,
    requestId,
    statusFilter,
    createForm,
    updateCreateField,
    canCreate,
    canGenerateSignedPdf,
    setRequestId,
    setStatusFilter,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCreate,
    handleLoadList,
    handleSelectRequest,
    handleLoadDetail,
    handleLoadTechnicalDetail,
    handleViewSignedPdf,
    handleDownloadSignedPdf,
    handleViewSignedPdfByRequestId,
    handleDownloadSignedPdfByRequestId,
    generateSignedPdfBlob,
    generateSignedPdfBlobByRequestId,
    creacion,
    listado,
    detalle,
    detalleTecnico,
  };
}