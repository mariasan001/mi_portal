import { Check, X } from 'lucide-react';

import { useAdminBackgroundTask } from '../../context/admin-background-task.context';
import s from './AdminFloatingBubble.module.css';

function getToneClass(status: ReturnType<typeof useAdminBackgroundTask>['backgroundTask']['status']) {
  if (status === 'success') return s.success;
  if (status === 'error') return s.error;
  return s.running;
}

function renderCenter(progress: number, status: ReturnType<typeof useAdminBackgroundTask>['backgroundTask']['status']) {
  if (status === 'success') {
    return <Check size={16} strokeWidth={3} />;
  }

  if (status === 'error') {
    return <X size={16} strokeWidth={3} />;
  }

  return <span>{`${Math.round(progress)}%`}</span>;
}

export default function AdminFloatingBubble() {
  const { backgroundTask } = useAdminBackgroundTask();

  if (!backgroundTask.visible) return null;

  const queueLabel =
    typeof backgroundTask.currentIndex === 'number' &&
    typeof backgroundTask.totalItems === 'number'
      ? `${backgroundTask.currentIndex}/${backgroundTask.totalItems}`
      : null;

  return (
    <aside
      className={`${s.bubble} ${getToneClass(backgroundTask.status)}`}
      aria-live="polite"
      title={`${backgroundTask.title} ${backgroundTask.detail}`}
      style={{ ['--progress' as string]: `${Math.round(backgroundTask.progress)}%` }}
    >
      <div className={s.ring}>
        <div className={s.inner}>
          {renderCenter(backgroundTask.progress, backgroundTask.status)}
        </div>
      </div>
      {queueLabel ? <span className={s.queueBadge}>{queueLabel}</span> : null}
    </aside>
  );
}
