# Rule: Structured Frontend API Error Handling

## Scope
- /frontend/src/App.tsx
- Any future API client module in /frontend/src/lib

## Rationale
- Current error handling collapses all failures into one generic message and drops actionable diagnostics.

## Standard & Guidelines
- Distinguish HTTP, network, timeout, and parsing errors.
- Preserve error context for logging while showing user-friendly messages.
- Never swallow error reasons in catch blocks.

## Examples

### ❌ Incorrect (Don't)
```typescript
fetchFinancialData()
  .then((movements) => {
    setMetrics(computeKPIs(movements))
  })
  .catch(() => {
    setError("No se pudo cargar la informacion financiera. Revisa la API de backend.")
  })
```

### ✅ Correct (Do)
```typescript
fetchFinancialData()
  .then((movements) => {
    setMetrics(computeKPIs(movements))
  })
  .catch((err: unknown) => {
    if (err instanceof TypeError) {
      setError("No hay conexion con el backend.")
      return
    }

    if (err instanceof Error && err.message.includes("Failed to fetch financial data")) {
      setError("La API respondio con error. Revisa estado y logs.")
      return
    }

    setError("Ocurrio un error inesperado al cargar los datos.")
    console.error("financial-data-load-error", err)
  })
```
