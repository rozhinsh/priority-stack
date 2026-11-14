export type Task = { id: string; title: string; completed: boolean };
export const STORAGE_KEY = 'priority-stack:tasks:v1';
const DEFAULT_TASKS: readonly Task[] = [
  { id: 'demo-01', title: "Map out this week's priorities", completed: true },
  { id: 'demo-02', title: 'Polish my portfolio README', completed: false },
  { id: 'demo-03', title: "Review a teammate's pull request", completed: false },
  { id: 'demo-04', title: 'Ship the drag-and-drop demo', completed: false },
  { id: 'demo-05', title: 'Write one useful unit test', completed: false },
];
export function getDefaultTasks(): Task[] { return DEFAULT_TASKS.map(task => ({ ...task })); }
function isTask(value: unknown): value is Task {
  if (value === null || typeof value !== 'object') return false;
  const task = value as Record<string, unknown>;
  return typeof task.id === 'string' && task.id.length > 0 &&
    typeof task.title === 'string' && task.title.trim().length > 0 &&
    task.title.length <= 100 && typeof task.completed === 'boolean';
}
export function parseStoredTasks(raw: string | null): Task[] | null {
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length > 200) return null;
    const ids = new Set<string>();
    for (const item of parsed) {
      if (!isTask(item) || ids.has(item.id)) return null;
      ids.add(item.id);
    }
    return parsed;
  } catch { return null; }
}
export function reorderItems<T>(items: readonly T[], from: number, to: number): T[] {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 ||
      from >= items.length || to >= items.length || from === to) return [...items];
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
export function loadTasks(): Task[] {
  try { return parseStoredTasks(window.localStorage.getItem(STORAGE_KEY)) ?? getDefaultTasks(); }
  catch { return getDefaultTasks(); }
}
export function saveTasks(tasks: readonly Task[]): void {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch { /* Continue without persistence if storage is unavailable. */ }
}
