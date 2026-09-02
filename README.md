# SprintDesk

SprintDesk is a sprint management dashboard built as part of a frontend engineering assignment.

The goal of the project was to build a small but production-oriented React application rather than a static UI. The application includes authentication, a persistent Kanban board, task management, analytics, notifications, theme switching, reusable UI components, responsive layouts, accessibility considerations, and automated tests.

## Live Demo

GitHub repository:

**https://github.com/BhupinderSingh9443/sprintdesk-frontend-assignment**


---

## Features

### Authentication

SprintDesk uses the DummyJSON authentication API.

The authentication flow includes:

- Username and password login
- Access token stored in application memory
- Refresh token persisted in localStorage
- Automatic Bearer token attachment through an Axios interceptor
- Silent token refresh when an authenticated request returns `401`
- Automatic retry of the failed request after token refresh
- Session restoration after a browser refresh
- Protected application routes
- Redirects for authenticated and unauthenticated users
- Logout and authentication state cleanup
- Full-screen loading state while the existing session is being restored

### Kanban Sprint Board

The application contains four workflow columns:

- Backlog
- In Progress
- Review
- Done

The board supports:

- Initial task data loaded from `mock-data.json`
- Drag and drop using `@dnd-kit`
- Reordering within the same column
- Moving tasks between columns
- Persistent board state using Zustand and localStorage
- Priority, assignee and due-date information
- Dynamic task counts
- Task details drawer
- Editing task information
- Adding comments
- Creating new tasks
- Deleting tasks with confirmation

### Analytics

The Analytics page is derived from the actual board state rather than hardcoded values.

It includes:

- Sprint Velocity
- Task Status distribution
- Priority Breakdown
- Completion Trend

The charts are implemented using Recharts and automatically respond to changes made on the Kanban board.

### Notifications

SprintDesk includes a simulated real-time notification system.

The application:

- Loads initial notifications from `mock-data.json`
- Polls JSONPlaceholder for simulated incoming notifications
- Treats unseen post IDs as new notifications
- Displays an unread notification count
- Supports read and unread notification states
- Supports "Mark all as read"
- Persists notification state in localStorage
- Pauses polling while the browser tab is hidden
- Resumes polling when the tab becomes visible
- Displays a toast when new notifications arrive while the notification panel is closed

### Light and Dark Theme

The application supports persistent light and dark themes.

The selected theme is stored locally so it remains active after the page is refreshed.

### Reusable Component System

The UI components were built from scratch using Tailwind CSS rather than an external component library.

Reusable components include:

- Button
- Input
- Select
- Modal
- Confirmation Dialog
- Toast
- DataTable
- Skeleton
- Page Loader
- Full-Screen Loader

---

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | React |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Server State | TanStack Query |
| Client State | Zustand |
| HTTP Client | Axios |
| Drag and Drop | @dnd-kit |
| Charts | Recharts |
| Testing | Vitest |
| Component Testing | React Testing Library |
| Authentication API | DummyJSON |
| Notification API | JSONPlaceholder |
| Initial Application Data | mock-data.json |

---

## Application Routes

### `/login`

Public authentication page.

Authenticated users are redirected away from this route.

### `/dashboard`

Protected dashboard showing recent sprint activity.

### `/board`

Protected Kanban sprint board used for task management.

### `/analytics`

Protected analytics dashboard containing sprint and task visualisations.

All application routes except `/login` require an authenticated session.

---

## State Management

One of the main architectural decisions in SprintDesk was to avoid putting every type of state into one global store.

### TanStack Query

TanStack Query is used for server-style state such as:

- Data requests
- Loading states
- Error states
- Caching
- Refetching
- Notification polling

### Zustand

Zustand is used for application state that needs to be shared or persisted, including:

- Authentication state
- Kanban board state
- Notifications
- Theme preferences

### Local React State

Local component state is used where the state only belongs to one interface component.

Examples include:

- Modal visibility
- Selected task ID
- Drawer form fields
- Mobile navigation state

This keeps global state focused and avoids unnecessary complexity.

---

## Data Architecture

The UI is intentionally not coupled directly to the JSON data source.

The general data flow is:

UI Components

↓

Feature Hooks / TanStack Query

↓

Service / API Layer

↓

Data Source

↓

`mock-data.json`, DummyJSON or JSONPlaceholder

This means the current mock data source could later be replaced by a real backend with limited changes to the UI layer.

---

## Authentication Design

The access token is intentionally kept in memory rather than localStorage.

The refresh token is persisted locally so the application can restore the user's session after a browser refresh.

When an authenticated request returns `401`:

1. The Axios response interceptor reads the stored refresh token.
2. A refresh request is sent to DummyJSON.
3. The new access token is stored in memory.
4. The new refresh token is persisted.
5. The original failed request is retried automatically.

Concurrent refresh requests are also controlled so multiple failed requests do not unnecessarily trigger multiple token refreshes.

---

## Persistence

The following application state is persisted in localStorage:

- Refresh token
- Kanban board state
- Notifications
- Theme preference

The access token is intentionally not persisted.

---

## Accessibility

Accessibility was treated as part of the component design rather than as a final add-on.

The application includes:

- Semantic HTML
- Properly associated form labels
- Visible keyboard focus states
- Keyboard-accessible navigation
- Keyboard-enabled drag and drop
- Accessible names for icon-only controls
- Native dialog semantics for modals and the task drawer
- Skip-to-content navigation
- ARIA live regions for loading states and toast messages
- Appropriate decorative image handling
- Responsive layouts for smaller viewports

The application is also checked manually using keyboard-only navigation and Lighthouse.

---

## Performance

SprintDesk uses route-level code splitting through `React.lazy` and `Suspense`.

Performance optimisations are used where appropriate, including:

- `React.memo`
- `useMemo`
- `useCallback`
- Lazy-loaded routes
- Localised application state
- Derived analytics data rather than duplicated state

Lighthouse is used to validate the final production build.

Final Lighthouse results:

| Metric | Result |
| --- | --- |
| Performance | 99 |
| Accessibility | 100 |

---

## Testing

The project uses Vitest and React Testing Library.

Required test coverage includes:

- Zustand board store
  - Add task
  - Move task
  - Delete task
- `useToast`
- Authentication interceptor
  - Token refresh
  - Failed request retry

Run the complete test suite with:

```bash
npm run test
