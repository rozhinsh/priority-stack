# Priority Stack

A small, responsive priority-list app built with **React**, **TypeScript**, and **dnd-kit**. Drag tasks into the order that matters most, mark them complete, and pick up where you left off.

> A focused frontend portfolio demo. No backend, authentication, or paid services.

## Features

- **Drag-and-drop sorting** with the current `@dnd-kit/react` API (`DragDropProvider` and `useSortable`).
- **Dedicated drag handles**, so buttons inside a task remain clickable.
- **Keyboard interaction** using the built-in keyboard sensor.
- **Task management**: add, complete, remove, and clear completed tasks.
- **Local persistence** with defensive `localStorage` parsing and graceful fallback.
- **Responsive layout**, visible focus styles, reduced-motion support, and screen-reader announcements.
- **Pure utility tests** using Node's built-in test runner.

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Drag and drop | `@dnd-kit/react` 0.5.x |
| Tooling | Vite 8 |
| Tests | `node:test` (no extra test dependency) |
| Persistence | Browser `localStorage` |

This project uses the **new dnd-kit API**, not the legacy `DndContext` / `SortableContext` approach.

## Get started

**Requirements:** Node.js 22.13+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

To run tests and prepare a production build:

```bash
npm test
npm run build
npm run preview
```

## How drag-and-drop works

1. Each task is registered with `useSortable({ id, index, element, handle })`.
2. `DragDropProvider` manages pointer and keyboard sensors automatically.
3. The default optimistic sorting plugin handles visual movement during dragging.
4. On drop, `isSortable(source)` provides `initialIndex` and `index`.
5. A pure `reorderItems` function creates the next state, and an effect saves it to `localStorage`.

**Note:** In the new API, `source` and `target` can refer to the same sortable during optimistic sorting. That is why this project reads `source.initialIndex` / `source.index`, rather than comparing their IDs.

Relevant reference: [Managing sortable state](https://dndkit.com/react/guides/sortable-state-management/).

## Keyboard controls

Focus a task's drag handle and use:

- `Space` or `Enter` to start dragging.
- `ArrowUp` and `ArrowDown` to move.
- `Space` or `Enter` to drop, or `Escape` to cancel.

## Data and scope

Your tasks are stored **only in your browser**. Clearing site data resets the demo. There is no API, user account, sync, or collaboration. Styles load optional fonts from Google Fonts; task content is not sent to a backend.

The code intentionally stays small and avoids adding state-management or UI dependencies that are not necessary for this use case.

## Deploy

This is a static Vite application. Deploy the `dist/` directory produced by `npm run build` to GitHub Pages, Vercel, Netlify, or any static host. The Vite `base: './'` option allows serving the app from a repository subpath.

## Tests

`npm test` covers reordering, input bounds, validating browser-stored data, duplicate IDs, and initial-data copying. It does **not** replace browser-based tests of pointer, touch, or keyboard interactions.

## License

MIT — see [LICENSE](LICENSE).