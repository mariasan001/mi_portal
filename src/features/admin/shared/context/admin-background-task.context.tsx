'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

import type { NominaCargaBackgroundTask } from '@/features/admin/nomina/carga/model/carga.types';

const INITIAL_BACKGROUND_TASK: NominaCargaBackgroundTask = {
  visible: false,
  title: '',
  detail: '',
  progress: 0,
  status: 'idle',
};

type AdminBackgroundTaskContextValue = {
  backgroundTask: NominaCargaBackgroundTask;
  setBackgroundTask: Dispatch<SetStateAction<NominaCargaBackgroundTask>>;
};

const AdminBackgroundTaskContext =
  createContext<AdminBackgroundTaskContextValue | null>(null);

export function AdminBackgroundTaskProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [backgroundTask, setBackgroundTask] = useState<NominaCargaBackgroundTask>(
    INITIAL_BACKGROUND_TASK
  );

  const value = useMemo(
    () => ({
      backgroundTask,
      setBackgroundTask,
    }),
    [backgroundTask]
  );

  return (
    <AdminBackgroundTaskContext.Provider value={value}>
      {children}
    </AdminBackgroundTaskContext.Provider>
  );
}

export function useAdminBackgroundTask() {
  const context = useContext(AdminBackgroundTaskContext);

  if (!context) {
    throw new Error('useAdminBackgroundTask must be used inside AdminBackgroundTaskProvider.');
  }

  return context;
}
