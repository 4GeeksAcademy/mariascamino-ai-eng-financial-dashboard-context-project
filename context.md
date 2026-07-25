# context.task
- Realizar handover tecnico de la aplicacion Financial Dashboard con evidencia directa del codigo.
- Describir arquitectura, entry points, servicios, contratos API e infraestructura sin asumir funcionalidades no implementadas.
- Contrastar implementacion real con documentacion existente para explicitar discrepancias.

# context
- Proyecto full-stack con frontend React 19 + TypeScript (Vite) y backend FastAPI.
- El frontend implementa una SPA de una sola pantalla (sin router), con estado local y una unica llamada HTTP a GET /api/metrics.
- El backend expone multiples endpoints de metricas, pero genera datos mock en memoria en cada request (seed fija) y no utiliza base de datos persistente.
- Ejecucion local prevista mediante Docker Compose, con frontend en 5173 y backend en 8000 (debugpy en 5678).

## repository structure and entry points
- Raiz:
  - AGENTS.md
  - README.md y README.es.md
  - docker-compose.yml
  - backend/
  - frontend/
- Backend:
  - backend/app/main.py: crea FastAPI, configura CORS abierto e incluye router.
  - backend/app/routes.py: define modelos Pydantic, funciones de negocio y endpoints.
  - backend/tests/test_routes.py: valida endpoints y funciones clave.
  - backend/requirements.txt y backend/Dockerfile.
- Frontend:
  - frontend/src/main.tsx: bootstrap con createRoot y render de App.
  - frontend/src/App.tsx: fetch de datos, estados loading/error y composicion del dashboard.
  - frontend/src/components/dashboard/: KPIs y graficos (Recharts).
  - frontend/src/lib/: tipos, transformaciones y formatters.
  - frontend/vite.config.ts, frontend/package.json, frontend/Dockerfile, frontend/.env.example.

## architecture and services
- Frontend:
  - Framework y build: React + TypeScript + Vite.
  - Estado: useState/useEffect; no Redux, Zustand ni Context global.
  - Renderizado: cliente, una sola vista.
  - API: GET /api/metrics desde App; VITE_API_BASE_URL opcional.
  - Proxy dev: /api -> http://backend:8000 en Vite.
- Backend:
  - Framework: FastAPI + Pydantic.
  - Runtime: uvicorn con debugpy en Docker.
  - Persistencia: no hay DB/ORM/conexion externa.
  - Endpoints:
    - GET /health
    - GET /api/metrics
    - GET /api/metrics/facets
    - GET /api/metrics/summary
    - GET /api/metrics/categories/top
    - GET /api/metrics/comparison
    - GET /api/metrics/alerts
    - GET /api/metrics/b2b
    - GET /api/metrics/b2c
- Infraestructura y entorno:
  - docker-compose.yml define servicios frontend y backend con volumenes y puertos.
  - frontend/.env.example documenta VITE_API_BASE_URL como override opcional.
  - Scripts frontend: dev, build, lint, preview, test, test:watch, test:coverage.

# output context
## codebase evidence
- Archivos revisados para respaldar este contexto:
  - README.md
  - README.es.md
  - docker-compose.yml
  - AGENTS.md
  - backend/app/main.py
  - backend/app/routes.py
  - backend/tests/test_routes.py
  - backend/tests/conftest.py
  - backend/requirements.txt
  - backend/Dockerfile
  - frontend/package.json
  - frontend/vite.config.ts
  - frontend/Dockerfile
  - frontend/.env.example
  - frontend/index.html
  - frontend/src/main.tsx
  - frontend/src/App.tsx
  - frontend/src/index.css
  - frontend/src/lib/financial-types.ts
  - frontend/src/lib/financial-utils.ts
  - frontend/src/lib/financial-utils.test.ts
  - frontend/src/components/dashboard/dashboard-header.tsx
  - frontend/src/components/dashboard/kpi-row.tsx
  - frontend/src/components/dashboard/kpi-card.tsx
  - frontend/src/components/dashboard/income-outcome-chart.tsx
  - frontend/src/components/dashboard/profit-percent-chart.tsx

## corrections and discrepancies
- AGENTS.md indica revisar .agents y memory-bank, pero esos directorios no existen en el estado actual del repositorio.
- La UI solo integra GET /api/metrics; los endpoints adicionales del backend existen y tienen cobertura de tests, pero no estan conectados al frontend.
- No hay router frontend ni navegacion multi-vista.
- No existe base de datos real: la data es sintetica y generada por request.
- El periodo mostrado en la UI esta hardcodeado como 2024 - Full Year, mientras la logica del backend calcula fechas relativas al dia actual.
