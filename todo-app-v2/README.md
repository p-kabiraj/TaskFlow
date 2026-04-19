# TaskFlow — Full-Stack Todo App v2

> React + Express + SQLite · Scalable · Production-ready · Well-documented

---

## Quick Start

```bash
# 1. Install all dependencies (root + backend + frontend)
npm run install

# 2. Start both servers simultaneously
npm start
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:5000        |
| API root | http://localhost:5000/api    |

---

## Project Structure

```
todo-app/
├── package.json                  ← root runner (concurrently)
├── .gitignore
│
├── backend/
│   ├── .env                      ← environment variables (never commit)
│   ├── .env.example              ← safe template to commit
│   ├── package.json
│   └── src/
│       ├── server.js             ← Express app entry point
│       ├── config/
│       │   └── index.js          ← all config from .env in one place
│       ├── db/
│       │   └── database.js       ← SQLite connection + schema
│       ├── controllers/
│       │   └── taskController.js ← business logic (CRUD)
│       ├── routes/
│       │   └── taskRoutes.js     ← URL → controller mapping
│       └── middleware/
│           ├── errorHandler.js   ← global error handler
│           └── validateTask.js   ← request body validation
│
└── frontend/
    ├── .env                      ← REACT_APP_ variables
    ├── package.json              ← includes "proxy" for dev
    └── src/
        ├── index.js              ← ReactDOM entry
        ├── index.css             ← global reset + base styles
        ├── App.js                ← root component (thin orchestrator)
        ├── App.css               ← shell layout (navbar + sidebar + main)
        ├── styles/
        │   └── variables.css     ← ALL design tokens (colours, fonts…)
        ├── services/
        │   └── taskService.js    ← ALL fetch() calls live here
        ├── hooks/
        │   └── useTasks.js       ← ALL task state + actions live here
        ├── utils/
        │   └── helpers.js        ← shared pure utility functions
        └── components/
            ├── Navbar.js / .css
            ├── Sidebar.js / .css
            └── ToDoList.js / .css
```

---

## REST API Reference

All responses follow the shape `{ success: true, data: ... }` or `{ success: false, error: "..." }`.

| Method | Endpoint                | Body                              | Description              |
|--------|-------------------------|-----------------------------------|--------------------------|
| GET    | /api/tasks              | —                                 | List all tasks           |
| GET    | /api/tasks?filter=active| —                                 | List active tasks        |
| GET    | /api/tasks/:id          | —                                 | Get one task             |
| POST   | /api/tasks              | `{ title, priority? }`            | Create a task            |
| PATCH  | /api/tasks/:id          | `{ title?, completed?, priority?}`| Update a task (partial)  |
| DELETE | /api/tasks/:id          | —                                 | Delete a task            |
| DELETE | /api/tasks/completed    | —                                 | Clear all completed      |
| GET    | /api/health             | —                                 | Health check             |

**Priority values:** `"low"` · `"medium"` · `"high"`

---

## How to Make Common Changes

### Change a colour / font / spacing
Edit `frontend/src/styles/variables.css` — all design tokens are CSS variables defined there.

### Change the API base URL (for deployment)
Edit `frontend/.env`:
```
REACT_APP_API_URL=https://api.yourdomain.com
```

### Change the server port
Edit `backend/.env`:
```
PORT=8080
```

### Add a new task field (e.g. due date)
1. Add the column to the `CREATE TABLE` in `backend/src/db/database.js`
2. Handle it in `backend/src/controllers/taskController.js`
3. Add validation in `backend/src/middleware/validateTask.js`
4. Add the input to `<AddTaskForm>` in `frontend/src/components/ToDoList.js`
5. Display it in `<TaskItem>` in the same file

### Add a completely new resource (e.g. categories)
1. Add the table in `backend/src/db/database.js`
2. Create `backend/src/controllers/categoryController.js`
3. Create `backend/src/routes/categoryRoutes.js`
4. Register in `backend/src/server.js`: `app.use("/api/categories", categoryRoutes)`
5. Add `fetchCategories()` etc. to `frontend/src/services/taskService.js`

---

## Environment Variables

### Backend (`backend/.env`)
| Variable    | Default                  | Description                  |
|-------------|--------------------------|------------------------------|
| PORT        | 5000                     | Server port                  |
| NODE_ENV    | development              | Environment name             |
| DB_PATH     | ./data/todos.db          | SQLite file path             |
| CORS_ORIGIN | http://localhost:3000    | Allowed frontend origin      |

### Frontend (`frontend/.env`)
| Variable           | Default | Description                    |
|--------------------|---------|--------------------------------|
| REACT_APP_API_URL  | /api    | Backend base URL               |

---

## Tech Stack
- **Frontend:** React 18, custom CSS (no UI library)
- **Backend:** Node.js, Express 4, morgan (logging), dotenv
- **Database:** SQLite via `better-sqlite3`
- **Dev tooling:** concurrently, nodemon
