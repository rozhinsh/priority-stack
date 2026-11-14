import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import SortableTask from './components/SortableTask';
import { loadTasks, reorderItems, saveTasks } from './lib/tasks';
import type { Task } from './lib/tasks';

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [draft, setDraft] = useState('');
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setTasks(current => [...current, { id: newId(), title, completed: false }]);
    setDraft('');
    setAnnouncement(`Added ${title}.`);
  }

  function handleToggle(id: string) {
    setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  function handleRemove(id: string) {
    const removedTask = tasks.find(task => task.id === id);
    setTasks(current => current.filter(task => task.id !== id));
    if (removedTask) setAnnouncement(`Removed ${removedTask.title}.`);
  }

  function handleClearCompleted() {
    setTasks(current => current.filter(task => !task.completed));
    setAnnouncement('Completed tasks cleared.');
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Priority Stack home">
          <span className="brand__symbol" aria-hidden="true"><span /><span /><span /></span>
          <span>priority<span className="brand__accent">/</span>stack</span>
        </a>
        <span className="header-tag"><span className="header-tag__dot" /> SMALL TOOLS, BIG FOCUS</span>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero__eyebrow"><span /> YOUR PERSONAL PRIORITY SPACE</div>
          <h1 id="hero-heading">Put first things <em>first.</em></h1>
          <p>Less juggling, more doing. Capture your tasks, drag them into the right order, and focus on your next move.</p>
        </section>

        <div className="workspace">
          <section className="board" aria-labelledby="board-heading">
            <div className="board__heading">
              <div>
                <div className="overline">THE BOARD</div>
                <h2 id="board-heading">Your priorities <span className="board__count">{String(tasks.length).padStart(2, '0')}</span></h2>
              </div>
              <span className="storage-label"><span /> Saved locally</span>
            </div>

            <form className="composer" onSubmit={handleAdd}>
              <label htmlFor="task-title" className="sr-only">New task</label>
              <span className="composer__plus" aria-hidden="true">+</span>
              <input id="task-title" maxLength={100} autoComplete="off" value={draft}
                onChange={event => setDraft(event.target.value)} placeholder="What needs your attention?" />
              <button type="submit" disabled={!draft.trim()}>
                Add task
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <div className="list-header">
              <span><strong>{activeCount}</strong> to do <span className="list-header__sep">/</span> <strong>{completedCount}</strong> done</span>
              <span className="list-header__hint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="m8 5-3 3 3 3M16 19l3-3-3-3M5 8h10c2 0 4 2 4 4v4H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Drag to reorder
              </span>
            </div>

            <DragDropProvider onDragEnd={event => {
              if (event.canceled) return;
              const { source } = event.operation;
              if (!isSortable(source) || source.initialIndex === source.index) return;
              const movedTask = tasks[source.initialIndex];
              setTasks(current => reorderItems(current, source.initialIndex, source.index));
              if (movedTask) setAnnouncement(`${movedTask.title} moved to position ${source.index + 1}.`);
            }}>
              {tasks.length > 0 ? (
                <ul className="task-list" aria-label="Prioritized tasks">
                  {tasks.map((task, index) => (
                    <SortableTask key={task.id} task={task} index={index}
                      onToggle={handleToggle} onRemove={handleRemove} />
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  <div className="empty-state__icon" aria-hidden="true">+</div>
                  <h3>A clean slate.</h3><p>Add your first task above to get started.</p>
                </div>
              )}
            </DragDropProvider>
            <div className="board__footer">
              <span>Top of the list = top priority</span>
              {completedCount > 0 && <button type="button" onClick={handleClearCompleted}>Clear completed</button>}
            </div>
          </section>

          <aside className="side-panel" aria-labelledby="progress-heading">
            <div className="side-panel__corner" aria-hidden="true"><span /></div>
            <div className="overline overline--light">A LITTLE MOMENTUM</div>
            <div className="progress-summary">
              <div className="progress-summary__icon" aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m9 23 8 8L32 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p id="progress-heading">Look at you go.</p>
              <div className="progress-summary__number">{progress}<span>%</span></div>
              <p className="progress-summary__caption">of your tasks complete</p>
              <div className="progress-bar" role="progressbar" aria-label="Task completion"
                aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                <div style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-summary__detail">Progress is a collection of small wins.</p>
            </div>
            <div className="tips" id="sorting-instructions">
              <div className="tips__eyebrow">TIP: KEYBOARD FRIENDLY</div>
              <p>Focus a drag handle, press <kbd>Space</kbd> or <kbd>Enter</kbd>, use <kbd>↑</kbd> <kbd>↓</kbd> to move, then confirm with <kbd>Space</kbd> or <kbd>Enter</kbd>. Press <kbd>Esc</kbd> to cancel.</p>
            </div>
          </aside>
        </div>
        <footer className="footer">
          <span>Made to keep the important stuff in sight.</span>
          <span>React <span className="footer__dot">·</span> TypeScript <span className="footer__dot">·</span> dnd-kit</span>
        </footer>
      </main>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
    </div>
  );
}
