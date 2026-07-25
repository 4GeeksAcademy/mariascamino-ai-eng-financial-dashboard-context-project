# Technical Context & Stack - Financial Dashboard

## 1. Tech Stack Overview
- **Frontend:** React 19 + TypeScript sobre Vite.
  - Gestor de estado: estado local con `useState` y `useEffect` (sin Redux/Zustand).
  - UI/Charts: Tailwind CSS v4, componentes estilo shadcn, `lucide-react`, `recharts`.
  - Cliente HTTP: `fetch` nativo del navegador en `App.tsx`.
- **Backend:** Python + FastAPI.
  - API framework: FastAPI con `APIRouter`.
  - Validacion y contratos: Pydantic (`BaseModel`) y tipos `Literal`.
  - Base de datos: no hay conectores ni ORM; datos mock generados en memoria.
- **Infraestructura & Tooling:** Docker y Docker Compose.
  - `docker-compose.yml` levanta `frontend` y `backend`.
  - Frontend usa proxy de Vite (`/api` -> `http://backend:8000`).
  - Variable opcional de entorno frontend: `VITE_API_BASE_URL` (`frontend/.env.example`).
  - Build/ejecucion frontend con scripts npm y backend con uvicorn + debugpy en contenedor.

## 2. Key Dependencies
- Frontend (`frontend/package.json`):
  - Runtime: `react`, `react-dom`, `recharts`, `lucide-react`, `clsx`, `class-variance-authority`, `tailwind-merge`.
  - Dev/build/test: `vite`, `@vitejs/plugin-react`, `typescript`, `eslint`, `typescript-eslint`, `vitest`, `@vitest/coverage-v8`, `tailwindcss`, `@tailwindcss/vite`, `postcss`, `autoprefixer`.
- Backend (`backend/requirements.txt`):
  - `fastapi`, `uvicorn[standard]`, `debugpy`, `pytest`, `pytest-cov`, `httpx`.

## 3. Local Development Setup
- Opcion recomendada (repositorio):
  1. Ejecutar `docker compose up --build` desde la raiz.
  2. Acceder a frontend en `http://localhost:5173`.
  3. Acceder a backend en `http://localhost:8000`.
  4. Acceder a docs de API en `http://localhost:8000/docs`.
- Notas de entorno:
  - En local, el frontend usa proxy Vite para `/api` por defecto.
  - Solo si se necesita otro origen backend: copiar `frontend/.env.example` a `.env` y definir `VITE_API_BASE_URL`.
- Comandos utiles del frontend (si se ejecuta fuera de Docker):
  - `npm run dev`, `npm run build`, `npm run test`, `npm run lint`.
