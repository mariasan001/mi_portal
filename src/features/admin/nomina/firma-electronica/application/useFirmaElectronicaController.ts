'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { descargarPdfFirmado } from '@/features/admin/nomina/firma-electronica/api/firma-electronica.commands';
import type {
  CrearSolicitudFirmaPayload,
  FirmaCreateFormState,
  FirmaDetalleTecnicoDto,
  SignatureRequestStatus,
  SolicitudFirmaDetalleDto,
} from '@/features/admin/nomina/firma-electronica/model/firma-electronica.types';

import { buildSignedPdfWithTechnicalAppendix } from './buildSignedPdfWithTechnicalAppendix';
import { useFirmaElectronicaResource } from './useFirmaElectronicaResource';

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

export function useFirmaElectronicaController() {
  const {
    consultarListado,
    consultarDetalle,
    consultarDetalleTecnico,
    ejecutarCreacion,
    creacion,
    listado,
    detalle,
    detalleTecnico,
  } = useFirmaElectronicaResource();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

  const loadRequestDetails = useCallback(
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

  const handleOpenDetailsModal = useCallback(
    async (selectedRequestId: string) => {
      setIsDetailsModalOpen(true);
      await loadRequestDetails(selectedRequestId);
    },
    [loadRequestDetails]
  );

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
  }, []);

  const handleCreate = useCallback(async () => {
    if (!createPayload) {
      toast.error('Debes capturar archivo, CUTS y contrasena.');
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
          'No hay detalle tecnico disponible para generar el PDF.'
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

  return {
    isCreateModalOpen,
    isDetailsModalOpen,
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
    handleOpenDetailsModal,
    handleCloseDetailsModal,
    handleCreate,
    handleViewSignedPdfByRequestId,
    handleDownloadSignedPdfByRequestId,
    creacion,
    listado,
    detalle,
    detalleTecnico,
  };
}
