# Rule: UI Period Labels Must Come From Data, Not Hardcoded Strings

## Scope
- /frontend/src/App.tsx
- /frontend/src/components/dashboard/dashboard-header.tsx

## Rationale
- Hardcoded business periods can diverge from backend-generated ranges, causing misleading dashboards.

## Standard & Guidelines
- Derive displayed period from API data range or backend metadata endpoint.
- If the range is unknown, show a neutral fallback instead of a fixed year.
- Keep period formatting centralized in a utility function.

## Examples

### ❌ Incorrect (Don't)
```tsx
<DashboardHeader period="2024 - Full Year" />
```

### ✅ Correct (Do)
```tsx
const periodLabel = monthlyData.length
  ? `${monthlyData[0].month} - ${monthlyData[monthlyData.length - 1].month}`
  : "Periodo no disponible"

<DashboardHeader period={periodLabel} />
```
