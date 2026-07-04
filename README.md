# Household Inventory (Minimal Demo)

A small full-stack demo: React frontend, Python (Flask) backend, MySQL database.
Users can register/log in and manage a simple list of household items.

## Structure

```
frontend/    React (Vite) frontend
backend/     Flask API + MySQL models
```

## Backend setup

1. Make sure MySQL is running and create the database (or let the app do it, see below):
   ```sql
   CREATE DATABASE household_db;
   ```
   (`backend/schema.sql` has the full reference schema if you want to create tables manually.)

2. Configure environment variables:
   ```bash
   cd backend
   cp .env.example .env
   # edit .env with your MySQL host/user/password
   ```

3. Install dependencies and run:
   ```bash
   python3 -m venv venv
   source venv/bin/activate      # on Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```
   The API starts on `http://localhost:5000`. Tables (`users`, `items`) are created
   automatically on first run.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` and talks to the API at
`http://localhost:5000/api` by default (override with `VITE_API_URL` in a `.env` file).
(Note: when running via Docker Compose below, the backend is published on port `5050` instead.)

## Run everything with Docker

Requires Docker + Docker Compose.

```bash
cp .env.example .env   # adjust passwords/secrets if you like
docker compose up --build
```

This starts three containers:

- `mysql` – MySQL 8, data persisted in a named volume (`mysql_data`)
- `backend` – Flask API via gunicorn, on `http://localhost:5050` (host port configurable via `BACKEND_PORT` in `.env`)
- `frontend` – production build served by nginx, on `http://localhost:5173`

The backend waits for MySQL's healthcheck before starting. Stop everything with
`docker compose down` (add `-v` to also wipe the database volume).

## API endpoints

| Method | Endpoint                | Auth | Description          |
|--------|-------------------------|------|----------------------|
| POST   | /api/auth/register      | No   | Create an account    |
| POST   | /api/auth/login         | No   | Log in, get a token  |
| GET    | /api/items              | Yes  | List your items      |
| POST   | /api/items              | Yes  | Add an item          |
| PUT    | /api/items/:id          | Yes  | Update an item        |
| DELETE | /api/items/:id          | Yes  | Delete an item        |

Authenticated requests need `Authorization: Bearer <token>`.
