# Rule: Reuse Endpoint Filtering Logic Through Shared Service Functions

## Scope
- /backend/app/routes.py
- Backend metric endpoints under /api/metrics*

## Rationale
- The b2b and b2c endpoints duplicate filtering and response assembly logic. Duplication increases maintenance effort and causes behavior drift.

## Standard & Guidelines
- Extract reusable query/filter pipeline into one internal function.
- Keep endpoint handlers thin: validate inputs, call service, return response model.
- Avoid copy-pasting loops and filter pipelines across endpoints.

## Examples

### ❌ Incorrect (Don't)
```python
@router.get("/api/metrics/b2b")
def get_b2b_metrics(...):
    movements = [m for m in generate_mock_movements(seed=42) if m.business_type == "B2B"]
    filtered = filter_movements(movements, start_date, end_date, category, operation_type)
    return ensure_chronological_order(filtered)

@router.get("/api/metrics/b2c")
def get_b2c_metrics(...):
    movements = [m for m in generate_mock_movements(seed=42) if m.business_type == "B2C"]
    filtered = filter_movements(movements, start_date, end_date, category, operation_type)
    return ensure_chronological_order(filtered)
```

### ✅ Correct (Do)
```python
def get_metrics_by_business_type(
    business_type: BusinessType,
    start_date: date | None,
    end_date: date | None,
    category: Category | None,
    operation_type: OperationType | None,
) -> list[FinancialMovement]:
    base = [m for m in generate_mock_movements(seed=42) if m.business_type == business_type]
    return ensure_chronological_order(filter_movements(base, start_date, end_date, category, operation_type))
```
