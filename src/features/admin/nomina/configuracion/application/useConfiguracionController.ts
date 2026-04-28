'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/context/auth.context';

import type { ConfiguracionEntity } from '../model/configuracion.types';
import { usePeriodosResource } from './usePeriodosResource';
import { useVersionesResource } from './useVersionesResource';

export function useConfiguracionController() {
  const [activeEntity, setActiveEntity] = useState<ConfiguracionEntity>('periodo');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { sesion } = useAuth();
  const periodos = usePeriodosResource();
  const versiones = useVersionesResource();

  const activeError = useMemo(() => {
    if (activeEntity === 'periodo') {
      return periodos.errorLista || periodos.errorCreate;
    }

    return versiones.errorLista || versiones.errorCreate;
  }, [activeEntity, periodos.errorCreate, periodos.errorLista, versiones.errorCreate, versiones.errorLista]);

  function handleSelectEntity(entity: ConfiguracionEntity) {
    setActiveEntity(entity);
    setIsCreateModalOpen(false);
  }

  function handleSelectPeriodo(detalle: NonNullable<typeof periodos.detalle>) {
    periodos.seleccionarDetalle(detalle);
  }

  function handleSelectVersion(detalle: NonNullable<typeof versiones.detalle>) {
    versiones.seleccionarDetalle(detalle);
  }

  function openCreateModal() {
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
  }

  async function handleCreatePeriodo(
    payload: Parameters<typeof periodos.crearPeriodo>[0]
  ) {
    try {
      await periodos.crearPeriodo(payload);
      setIsCreateModalOpen(false);
      toast.success('Período creado o recuperado correctamente.');
    } catch {
      toast.error('No se pudo crear o recuperar el período.');
    }
  }

  async function handleCreateVersion(
    payload: Omit<Parameters<typeof versiones.crearVersion>[0], 'createdByUserId'>
  ) {
    const userId = sesion?.userId;

    if (!userId || !Number.isFinite(userId) || userId <= 0) {
      toast.error('No se pudo identificar al usuario autenticado.');
      return;
    }

    try {
      await versiones.crearVersion({
        ...payload,
        createdByUserId: userId,
      });

      setIsCreateModalOpen(false);
      toast.success('Versión creada correctamente.');
    } catch {
      toast.error('No se pudo crear la versión.');
    }
  }

  return {
    activeEntity,
    activeError,
    isCreateModalOpen,
    periodos,
    versiones,
    sesion,
    handleSelectPeriodo,
    handleSelectVersion,
    handleSelectEntity,
    handleCreatePeriodo,
    handleCreateVersion,
    openCreateModal,
    closeCreateModal,
  };
}
