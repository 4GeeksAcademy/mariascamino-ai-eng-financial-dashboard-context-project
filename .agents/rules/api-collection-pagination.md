# Rule: Paginate Collection Endpoints

## Scope
- /backend/app/routes.py endpoints returning list payloads
- Frontend consumers of list endpoints under /frontend/src

## Rationale
- Returning unbounded collections from API endpoints does not scale and can degrade response time and frontend performance.

## Standard & Guidelines
- Any collection endpoint must support limit and offset (or cursor).
- Enforce backend bounds with Query validators (for example ge and le).
- Frontend requests must explicitly pass pagination parameters instead of assuming full dumps.

## Examples

### ❌ Incorrect (Don't)
```python
@router.get("/api/metrics", response_model=list[FinancialMovement])
def get_metrics(...):
    movements = generate_mock_movements(seed=42)
    filtered = filter_movements(movements, start_date, end_date, category, operation_type)
    return ensure_chronological_order(filtered)
```

### ✅ Correct (Do)
```python
@router.get("/api/metrics", response_model=list[FinancialMovement])
def get_metrics(
    ...,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
) -> list[FinancialMovement]:
    movements = generate_mock_movements(seed=42)
    filtered = ensure_chronological_order(
        filter_movements(movements, start_date, end_date, category, operation_type)
    )
    return filtered[offset : offset + limit]
```
