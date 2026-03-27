'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';


import type {
  ContentMode,
  NominaEntity,
} from '../types/nomina-configuracion.types';
import { useNominaPeriodos } from '@/features/admin/hooks/useNominaPeriodos';
import { useNominaVersiones } from '@/features/admin/hooks/useNominaVersiones';

export function useNominaConfiguracionView() {
  const [activeEntity, setActiveEntity] = useState<NominaEntity>('periodo');
  const [mode, setMode] = useState<ContentMode>('resultados');
  const [searchId, setSearchId] = useState('');

  const periodos = useNominaPeriodos();
  const versiones = useNominaVersiones();

  const currentLoadingSearch =
    activeEntity === 'periodo' ? periodos.loadingDetalle : versiones.loadingDetalle;

  const canSearch = useMemo(() => {
    return searchId.trim().length > 0 && !currentLoadingSearch;
  }, [searchId, currentLoadingSearch]);

  const activeError = useMemo(() => {
    if (activeEntity === 'periodo') {
      return mode === 'resultados' ? periodos.errorDetalle : periodos.errorCreate;
    }

    return mode === 'resultados' ? versiones.errorDetalle : versiones.errorCreate;
  }, [
    activeEntity,
    mode,
    periodos.errorCreate,
    periodos.errorDetalle,
    versiones.errorCreate,
    versiones.errorDetalle,
  ]);

  function handleSelectEntity(entity: NominaEntity) {
    setActiveEntity(entity);
    setMode('resultados');
    setSearchId('');
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
        toast.success('Periodo consultado correctamente.');
      } else {
        await versiones.consultarPorId(id);
        toast.success('Versión consultada correctamente.');
      }

      setMode('resultados');
    } catch {
      toast.error(
        activeEntity === 'periodo'
          ? 'No se pudo consultar el periodo.'
          : 'No se pudo consultar la versión.'
      );
    }
  }

  async function handleCreatePeriodo(payload: Parameters<typeof periodos.crearPeriodo>[0]) {
    try {
      await periodos.crearPeriodo(payload);
      toast.success('Periodo creado o recuperado correctamente.');
    } catch {
      toast.error('No se pudo crear o recuperar el periodo.');
    }
  }

  async function handleCreateVersion(payload: Parameters<typeof versiones.crearVersion>[0]) {
    try {
      await versiones.crearVersion(payload);
      toast.success('Versión creada correctamente.');
    } catch {
      toast.error('No se pudo crear la versión.');
    }
  }

  return {
    activeEntity,
    mode,
    searchId,
    canSearch,
    activeError,
    periodos,
    versiones,
    currentLoadingSearch,

    setMode,
    setSearchId,
    handleSelectEntity,
    handleSearch,
    handleCreatePeriodo,
    handleCreateVersion,
  };
}