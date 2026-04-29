import { Check, X } from 'lucide-react';

import type { NominaCargaBackgroundTask } from '../../model/carga.types';
import s from './NominaCargaProgressBubble.module.css';

type Props = {
  task: NominaCargaBackgroundTask;
};

function getToneClass(status: NominaCargaBackgroundTask['status']) {
  if (status === 'success') return s.success;
  if (status === 'error') return s.error;
  return s.running;
}

function renderCenter(task: NominaCargaBackgroundTask) {
  if (task.status === 'success') {
    return <Check size={16} strokeWidth={3} />;
  }

  if (task.status === 'error') {
    return <X size={16} strokeWidth={3} />;
  }

  return <span>{`${Math.round(task.progress)}%`}</span>;
}

export default function NominaCargaProgressBubble({ task }: Props) {
  if (!task.visible) return null;

  const queueLabel =
    typeof task.currentIndex === 'number' && typeof task.totalItems === 'number'
      ? `${task.currentIndex}/${task.totalItems}`
      : null;

  return (
    <aside
      className={`${s.bubble} ${getToneClass(task.status)}`}
      aria-live="polite"
      title={`${task.title} ${task.detail}`}
      style={{ ['--progress' as string]: `${Math.round(task.progress)}%` }}
    >
      <div className={s.ring}>
        <div className={s.inner}>{renderCenter(task)}</div>
      </div>
      {queueLabel ? <span className={s.queueBadge}>{queueLabel}</span> : null}
    </aside>
  );
}
