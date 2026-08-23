# SprintDesk Architecture

## Overview

SprintDesk is a React + TypeScript sprint management application built with a production-style frontend architecture.

The main goal of the architecture is to keep UI, state management, API access, and feature logic separated so the application is easier to maintain and extend.

---

## High-Level Architecture

```text
UI Layer
Pages / Layouts / Reusable Components
        ↓
Feature Layer
Auth / Board / Analytics / Notifications / Theme
        ↓
State & Query Layer
Zustand / TanStack Query
        ↓
Service Layer
Axios / Auth Service / Mock Data Service / Notification Service
        ↓
Data Sources
DummyJSON / JSONPlaceholder / mock-data.json
Main Technologies
Area	Technology
Framework	React
Language	TypeScript
Build Tool	Vite
Styling	Tailwind CSS
Routing	React Router
Server State	TanStack Query
Client State	Zustand
HTTP Client	Axios
Drag & Drop	@dnd-kit
Charts	Recharts
Testing	Vitest + React Testing Library
Project Structure
src/
├── app/
├── components/
│   ├── navigation/
│   └── ui/
├── features/
│   ├── analytics/
│   ├── auth/
│   ├── board/
│   ├── notifications/
│   ├── theme/
│   └── toast/
├── layouts/
├── pages/
├── services/
├── stores/
├── tests/
└── types/

The project is organised mainly by feature so authentication, board management, analytics and notifications can remain independent.

Routing

Main routes:

/login
/dashboard
/board
/analytics

Routing structure:

BrowserRouter
├── PublicOnlyRoute
│   └── /login
└── ProtectedRoute
    └── AppLayout
        ├── /dashboard
        ├── /board
        └── /analytics

Authenticated users cannot return to /login, while protected routes redirect unauthenticated users back to login.

Routes are lazy-loaded using React.lazy and Suspense.

Authentication

SprintDesk uses DummyJSON authentication.

Login Flow
Login Form
   ↓
Auth Service
   ↓
POST /auth/login
   ↓
Access Token + Refresh Token
   ↓
Access Token → Zustand memory
Refresh Token → localStorage

The access token is not stored in localStorage.

When the browser is refreshed, SprintDesk uses the persisted refresh token to restore the session.

Token Refresh

Authenticated Axios requests automatically include:

Authorization: Bearer <accessToken>

If a request returns 401:

401
 ↓
Refresh token request
 ↓
Receive new tokens
 ↓
Update access token
 ↓
Retry original request
State Management

SprintDesk separates state based on responsibility.

TanStack Query

Used for:

Data fetching
Loading and error states
Request caching
Notification polling
Authentication mutations
Zustand

Used for:

Authentication state
Board tasks
Comments
Notifications
Theme preference
Local React State

Used for temporary UI state such as:

Modal visibility
Selected task
Form values
Mobile navigation
Notification panel state
Kanban Board

Initial task data is loaded from mock-data.json.

mock-data.json
   ↓
Service Layer
   ↓
TanStack Query
   ↓
Zustand Board Store
   ↓
Kanban UI

The board contains:

Backlog
In Progress
Review
Done

Users can:

Drag tasks between columns
Reorder tasks
Edit tasks
Add comments
Create tasks
Delete tasks

Board state is persisted in localStorage.

Analytics

Analytics are derived directly from the Zustand board state.

Board State
   ↓
Analytics Utility Functions
   ↓
Recharts

Charts include:

Sprint Velocity
Task Status
Priority Breakdown
Completion Trend

Because analytics use live board state, changes made to tasks automatically update the charts.

Notifications

SprintDesk uses two notification sources.

Initial Notifications

Loaded from:

mock-data.json
Simulated Real-Time Notifications

Polled from:

GET https://jsonplaceholder.typicode.com/posts?_limit=5

Flow:

Polling
 ↓
Check unseen post IDs
 ↓
Create notifications
 ↓
Zustand store
 ↓
Unread count + Notification panel
 ↓
Toast if panel is closed

Notification state is persisted in localStorage.

Polling pauses when the browser tab is hidden and resumes when the tab becomes visible again.

Reusable UI Components

Reusable components include:

Button
Input
Select
Modal
ConfirmDialog
DataTable
Skeleton
PageLoader
FullScreenLoader
Toast

These components help keep styling, accessibility, dark mode and interaction behaviour consistent.

Accessibility

Accessibility is handled through:

Semantic HTML
Proper form labels
Keyboard navigation
Visible focus states
Accessible names for icon-only controls
Native dialog elements
Keyboard-enabled drag and drop
Skip-to-content navigation
ARIA live regions for loading and toast messages
Responsive layouts

Lighthouse and manual keyboard testing are used for final validation.

Performance

Performance improvements include:

Route-level lazy loading
React.memo
useMemo
useCallback
TanStack Query caching
Pausing polling when tabs are hidden
Keeping local UI state local

The production build is tested using Lighthouse.

Testing

Testing uses Vitest and React Testing Library.

Required tests cover:

Board store
Add
Move
Delete
useToast
Authentication interceptor
Token refresh
Retry after 401

Run tests with:

npm run test
Data Sources

SprintDesk currently uses:

mock-data.json
→ users, tasks, sprints, comments, initial notifications

DummyJSON
→ authentication and token refresh

JSONPlaceholder
→ simulated real-time notifications
Persistence
Data	Storage
Access token	Memory
Refresh token	localStorage
Board state	localStorage
Notifications	localStorage
Theme	localStorage
Toasts	Memory
Current Limitations

SprintDesk is a frontend assignment and does not use a real backend.

Because of this:

Task changes are stored locally
Comments are stored locally
Notifications are simulated
Multi-user synchronization is not available

The service layer keeps these data sources separated so they can be replaced with real backend APIs later.