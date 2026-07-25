# Product Context - Financial Dashboard

## 1. Problem Statement & Purpose
- La aplicacion busca ofrecer una vista ejecutiva de metricas financieras en una interfaz web unica, mostrando KPIs de ingresos/egresos, utilidad y margen de utilidad.
- Segun el codigo del frontend, el flujo principal es consumir movimientos financieros desde el backend y transformarlos en indicadores y series mensuales para visualizacion.
- Segun el backend, el sistema expone endpoints de metricas, resumenes, comparativas y alertas para habilitar analisis financiero basico.

## 2. Core User Workflows & Features
- Carga inicial del dashboard:
  - El frontend ejecuta `GET /api/metrics` al montar la app y calcula KPIs y datos mensuales para los graficos.
- Visualizacion de indicadores clave:
  - Tarjetas con total income, total outcome, profit y profit margin.
- Visualizacion de tendencias:
  - Grafico de lineas Income vs Outcome por mes.
  - Grafico de Profit Margin % por mes.
- Respuesta ante fallo de API:
  - Si la carga falla, se muestra un mensaje de error en la UI.
- Capacidades API disponibles en backend (aunque no todas conectadas en UI actual):
  - `/api/metrics`, `/api/metrics/facets`, `/api/metrics/summary`, `/api/metrics/categories/top`, `/api/metrics/comparison`, `/api/metrics/alerts`, `/api/metrics/b2b`, `/api/metrics/b2c`, `/health`.

## 3. Target Audience & Business Value
- Audiencia objetivo probable por evidencia funcional:
  - Usuarios de negocio/operaciones que necesitan monitorear rendimiento financiero agregado.
  - Equipos tecnicos o de datos que requieren una base API para analisis de metricas.
- Valor de negocio actual:
  - Entrega una lectura rapida del estado financiero con componentes visuales claros.
  - Permite experimentar filtros y analitica desde API sin dependencia de una base de datos real.
  - Sirve como base de handover y evolucion hacia un producto con datos persistentes y workflows mas avanzados.
