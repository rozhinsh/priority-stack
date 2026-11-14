import { useRef } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import type { Task } from '../lib/tasks';

type Props = {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function SortableTask({ task, index, onToggle, onRemove }: Props) {
  const elementRef = useRef<HTMLLIElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const { isDragging, isDropTarget } = useSortable({
    id: task.id, index, element: elementRef, handle: handleRef,
  });

  return (
    <li ref={elementRef} className={['task', task.completed && 'task--completed', isDragging && 'task--dragging', isDropTarget && 'task--target'].filter(Boolean).join(' ')}>
      <button
        ref={handleRef}
        type="button"
        className="task__handle"
        aria-label={`Reorder ${task.title}`}
        aria-describedby="sorting-instructions"
        title="Drag to change priority"
      >
        <svg viewBox="0 0 18 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="5" r="1.5" /><circle cx="13" cy="5" r="1.5" />
          <circle cx="5" cy="12" r="1.5" /><circle cx="13" cy="12" r="1.5" />
          <circle cx="5" cy="19" r="1.5" /><circle cx="13" cy="19" r="1.5" />
        </svg>
      </button>
      <button
        type="button"
        className="task__checkbox"
        aria-label={`${task.completed ? 'Mark as active' : 'Mark as complete'}: ${task.title}`}
        aria-pressed={task.completed}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>}
      </button>
      <span className="task__title">{task.title}</span>
      <span className="task__position" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <button type="button" className="task__remove" aria-label={`Remove ${task.title}`} title="Remove task" onClick={() => onRemove(task.id)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </li>
  );
}
