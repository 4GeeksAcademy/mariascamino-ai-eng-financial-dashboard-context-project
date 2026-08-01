# Financial Dashboard Formatting Standards

## Objective
Establecer reglas estrictas para el formateo de datos financieros (monedas, porcentajes y fechas) en todos los componentes del dashboard.

## Inputs
- Componentes React en `frontend/src/components` que rendericen saldos, métricas o gráficos.

## Expected Output
- Todos los valores numéricos monetarios formateados en USD (`$X,XXX.XX`).
- Indicadores de pérdidas/ganancias con color codificado (`text-green-600` para positivo, `text-red-600` para negativo).

## Acceptance Criteria
- No existen datos numéricos financieros renderizados sin formato (raw numbers).
- Fechas presentadas de forma consistente en formato ISO o local legible.