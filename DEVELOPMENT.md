# Development Guide

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Frontend Architecture](#frontend-architecture)
- [Development Guide](#development-guide)
- [Command Reference](#command-reference)

---

## Overview

A full-stack Todo List web application supporting CRUD operations, category management, priority levels, search/filter, and drag-and-drop reordering. Data is persisted via SQLite.

### Core Features

| Feature | Description |
|---------|-------------|
| Add Todo | Enter a title, select category and priority |
| Edit Todo | Modify title, category, or priority |
| Delete Todo | Remove a single todo item |
| Toggle Completion | Check/uncheck completion status with strikethrough styling |
| Categories | Custom category labels with category-based filtering |
| Priority | Three levels (High / Medium / Low) with color-coded badges |
| Search | Filter todos by title keyword |
| Drag & Drop | Reorder todos by dragging; sort order persists to database |
| Persistence | SQLite database storage; data survives page refreshes |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | ^18.3.1 |
| Build Tool | Vite | ^5.4.0 |
| Styling | CSS Modules | — |
| Backend | Express | ^4.21.0 |
| Database | SQLite (better-sqlite3) | ^11.0.0 |
| CORS | cors | ^2.8.5 |
| Package Management | npm workspaces | — |

---

## Project Structure

```
todo-app/
├── package.json                # Root config (npm workspaces)
├── package-lock.json
├── README.md                   # Project overview
├── DEVELOPMENT.md              # This document
│
├── client/                     # Frontend
│   ├── package.json
│   ├── vite.config.js          # Vite config (includes API proxy)
│   ├── index.html              # HTML entry point
│   ├── dist/                   # Production build output
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Root component (state management)
│       ├── App.module.css
│       ├── api/
│       │   └── todos.js        # API request functions
│       └── components/
│           ├── TodoForm.jsx    # Add/edit form
│           ├── TodoForm.module.css
│           ├── TodoList.jsx    # List container + drag-and-drop
│           ├── TodoList.module.css
│           ├── TodoItem.jsx    # Single todo item
│           ├── TodoItem.module.css
│           ├── FilterBar.jsx   # Search & filter bar
│           └── FilterBar.module.css
│
└── server/                     # Backend
    ├── package.json
    ├── index.js                # Express entry point
    ├── db.js                   # SQLite database initialization
    ├── todos.db                # SQLite database file
    └── routes/
        └── todos.js            # REST API routes
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install Dependencies

```bash
cd todo-app
npm install
```

npm workspaces will automatically install dependencies for both `client` and `server`.

### Start Development Servers

Open **two terminal windows**:

**Terminal 1 — Backend (port 3001):**

```bash
cd server
npm start
```

**Terminal 2 — Frontend (port 5173):**

```bash
cd client
npm run dev
```

### Access the App

Open your browser and navigate to: **http://localhost:5173**

### Stop Servers

- Press **`Ctrl + C`** in the corresponding terminal window
- Or forcefully terminate via command:
  ```bash
  # Stop backend
  lsof -ti :3001 | xargs kill
  # Stop frontend
  lsof -ti :5173 | xargs kill
  ```

### Production Build

```bash
cd client
npm run build     # Output to client/dist/
npm run preview   # Preview the production build
```

---

## API Reference

Base URL: `http://localhost:3001`

### GET /api/todos

Retrieve all todos with optional filtering.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| priority | string | Filter by priority (low/medium/high) |
| search | string | Search by title (partial match) |

**Example Requests:**

```bash
# Get all todos
curl http://localhost:3001/api/todos

# Filter by high priority
curl http://localhost:3001/api/todos?priority=high

# Search by keyword
curl http://localhost:3001/api/todos?search=groceries

# Combined filters
curl "http://localhost:3001/api/todos?category=work&priority=high"
```

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "title": "Finish project report",
    "completed": 0,
    "category": "work",
    "priority": "high",
    "sort_order": 0,
    "created_at": "2026-02-08 12:00:00"
  }
]
```

---

### POST /api/todos

Create a new todo.

**Request Body:**

```json
{
  "title": "Finish project report",
  "category": "work",
  "priority": "high"
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | string | Yes | — | Todo title (must not be empty) |
| category | string | No | "" | Category label |
| priority | string | No | "medium" | Priority level (low/medium/high) |

**Response:** `201 Created`

```json
{
  "id": 1,
  "title": "Finish project report",
  "completed": 0,
  "category": "work",
  "priority": "high",
  "sort_order": 1,
  "created_at": "2026-02-08 12:00:00"
}
```

**Error Response:** `400 Bad Request`

```json
{ "error": "Title is required" }
```

---

### PUT /api/todos/:id

Update a specific todo.

**Request Body (all fields optional):**

```json
{
  "title": "Updated title",
  "completed": 1,
  "category": "personal",
  "priority": "low"
}
```

| Field | Type | Description |
|-------|------|-------------|
| title | string | New title |
| completed | number | 0 = incomplete, 1 = complete |
| category | string | New category |
| priority | string | New priority |

**Response:** `200 OK` — Returns the updated todo object

**Error Response:** `404 Not Found`

```json
{ "error": "Todo not found" }
```

---

### DELETE /api/todos/:id

Delete a specific todo.

**Example:**

```bash
curl -X DELETE http://localhost:3001/api/todos/1
```

**Response:** `200 OK`

```json
{ "message": "Todo deleted" }
```

**Error Response:** `404 Not Found`

---

### PUT /api/todos/reorder

Batch update sort order (called after drag-and-drop).

**Request Body:**

```json
{
  "orderedIds": [3, 1, 4, 2]
}
```

The array index becomes the new `sort_order` value for each ID.

**Response:** `200 OK`

```json
{ "message": "Reordered" }
```

> This endpoint uses a database transaction to ensure atomicity.

---

## Database Schema

### todos table

```sql
CREATE TABLE IF NOT EXISTS todos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  completed   INTEGER DEFAULT 0,
  category    TEXT    DEFAULT '',
  priority    TEXT    DEFAULT 'medium',
  sort_order  INTEGER DEFAULT 0,
  created_at  TEXT    DEFAULT (datetime('now', 'localtime'))
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Auto-incrementing primary key |
| title | TEXT | NOT NULL | Todo title |
| completed | INTEGER | DEFAULT 0 | Completion status (0 = incomplete, 1 = complete) |
| category | TEXT | DEFAULT '' | Category label |
| priority | TEXT | DEFAULT 'medium' | Priority level (low/medium/high) |
| sort_order | INTEGER | DEFAULT 0 | Drag-and-drop sort order |
| created_at | TEXT | DEFAULT datetime | Creation timestamp (local time) |

**Database Configuration:**
- File path: `server/todos.db`
- WAL (Write-Ahead Logging) mode enabled for better concurrent read/write performance
- Table is auto-created on first server startup

---

## Frontend Architecture

### Component Hierarchy

```
App (centralized state management)
├── FilterBar (search + category/priority filters)
├── TodoForm (add/edit input form)
└── TodoList (list container + drag-and-drop logic)
    └── TodoItem × N (individual todo items)
```

### State Management

All state is managed centrally in `App.jsx` and passed to child components via props:

| State | Type | Description |
|-------|------|-------------|
| todos | Array | List of todo items |
| filters | Object | Current filter criteria {category, priority, search} |
| editingTodo | Object / null | Todo currently being edited |

### Data Flow

```
User Action → Component Callback → App calls API → Updates State → Re-render
```

### API Proxy

In development mode, Vite proxies `/api` requests to the backend:

```js
// vite.config.js
server: {
  port: 5173,
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

Frontend code requests `/api/todos` directly without specifying the full backend URL.

---

## Development Guide

### Adding a New Field

Example: adding a `due_date` field.

1. **Database** — Edit `server/db.js`, add the column to the CREATE TABLE statement:
   ```sql
   due_date TEXT DEFAULT ''
   ```
   > If the database already exists, run manually: `ALTER TABLE todos ADD COLUMN due_date TEXT DEFAULT ''`

2. **API** — Edit `server/routes/todos.js`:
   - POST route: destructure `due_date` from `req.body`, include in INSERT statement
   - PUT route: add `due_date` update logic

3. **Frontend API layer** — Edit `client/src/api/todos.js` (usually no changes needed; data passes through)

4. **Frontend components**:
   - `TodoForm.jsx`: add a date picker input
   - `TodoItem.jsx`: display the due date

### Adding a New Filter

1. `FilterBar.jsx` — Add a new filter control
2. `App.jsx` — Add a new field to the `filters` state object
3. `api/todos.js` — Pass the new parameter in the query string
4. `server/routes/todos.js` — Handle the new query parameter in the GET route

### Code Conventions

- Functional components with React Hooks
- CSS Modules (`*.module.css`) with class names accessed via `styles.className`
- API requests centralized in `client/src/api/todos.js`
- Backend routes organized under `server/routes/`

---

## Command Reference

| Command | Directory | Description |
|---------|-----------|-------------|
| `npm install` | Root | Install all dependencies |
| `npm start` | server/ | Start backend (port 3001) |
| `npm run dev` | server/ | Start backend in watch mode |
| `npm run dev` | client/ | Start frontend dev server (port 5173) |
| `npm run build` | client/ | Production build |
| `npm run preview` | client/ | Preview production build |
| `Ctrl + C` | Terminal | Stop the running server |
| `lsof -ti :3001 \| xargs kill` | Any | Force-kill backend |
| `lsof -ti :5173 \| xargs kill` | Any | Force-kill frontend |
