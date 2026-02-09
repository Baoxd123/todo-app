# Todo List

A full-stack todo list web application with category management, priority levels, search/filter, and drag-and-drop reordering.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | CSS Modules |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| Monorepo | npm workspaces |

## Features

- Create, edit, delete, and toggle completion of todos
- Categorize todos with custom labels
- Set priority levels (High / Medium / Low) with color-coded badges
- Search todos by title
- Filter by category and/or priority
- Drag-and-drop reordering with persistent sort order
- SQLite database for data persistence
- RESTful API with full CRUD support

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install

```bash
cd todo-app
npm install
```

### Run

Start the backend and frontend in two separate terminals:

```bash
# Terminal 1 — Backend (port 3001)
cd server
npm start

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
cd client
npm run build
npm run preview
```

## Project Structure

```
todo-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.jsx          # Root component & state management
│   │   ├── api/todos.js     # API request layer
│   │   └── components/
│   │       ├── TodoForm.jsx  # Add/edit form
│   │       ├── TodoList.jsx  # List container + drag-and-drop
│   │       ├── TodoItem.jsx  # Single todo item
│   │       └── FilterBar.jsx # Search & filter controls
│   └── vite.config.js       # Vite config with API proxy
│
└── server/                  # Express backend
    ├── index.js             # Server entry point
    ├── db.js                # SQLite initialization
    └── routes/todos.js      # REST API routes
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/todos` | List todos (supports `?category=`, `?priority=`, `?search=`) |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |
| PUT | `/api/todos/reorder` | Batch update sort order |

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed API documentation, database schema, frontend architecture, and development guides.

## License

MIT
