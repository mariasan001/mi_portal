'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/context/auth.context';
import type { ConfiguracionEntity } from '../model/configuracion.types';
import { usePeriodosResource } from './usePeriodosResource';
import { useVersionesResource } from './useVersionesResource';

export function useConfiguracionController() {
  const [activeEntity, setActiveEntity] = useState<ConfiguracionEntity>('periodo');
  const [searchId, setSearchId] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { sesion } = useAuth();
  const periodos = usePeriodosResource();
  const versiones = useVersionesResource();

  const currentLoadingSearch =
    activeEntity === 'periodo'
      ? periodos.loadingDetalle
      : versiones.loadingDetalle;

  const canSearch = useMemo(() => {
    return searchId.trim().length > 0 && !currentLoadingSearch;
  }, [searchId, currentLoadingSearch]);

  const activeError = useMemo(() => {
    if (activeEntity === 'periodo') {
      return periodos.errorLista || periodos.errorDetalle || periodos.errorCreate;
    }

    return versiones.errorLista || versiones.errorDetalle || versiones.errorCreate;
  }, [
    activeEntity,
    periodos.errorCreate,
    periodos.errorDetalle,
    periodos.errorLista,
    versiones.errorCreate,
    versiones.errorDetalle,
    versiones.errorLista,
  ]);

  function handleSelectEntity(entity: ConfiguracionEntity) {
    setActiveEntity(entity);
    setSearchId('');
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

  async function handleSearch() {
    const id = Number(searchId);

    if (!Number.isFinite(id) || id <= 0) {
      toast.warning(
        activeEntity === 'periodo'
          ? 'Captura un periodId válido.'
          : 'Captura un versionId válido.'
      );
      return;
    }

    try {
      if (activeEntity === 'periodo') {
        await periodos.consultarPorId(id);
        toast.success('Período consultado correctamente.');
      } else {
        await versiones.consultarPorId(id);
        toast.success('Versión consultada correctamente.');
      }
    } catch {
      toast.error(
        activeEntity === 'periodo'
          ? 'No se pudo consultar el período.'
          : 'No se pudo consultar la versión.'
      );
    }
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
    searchId,
    canSearch,
    activeError,
    isCreateModalOpen,
    periodos,
    versiones,
    currentLoadingSearch,
    sesion,
    setSearchId,
    handleSelectPeriodo,
    handleSelectVersion,
    handleSelectEntity,
    handleSearch,
    handleCreatePeriodo,
    handleCreateVersion,
    openCreateModal,
    closeCreateModal,
  };
}
