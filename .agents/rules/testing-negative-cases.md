# Rule: Include Negative and Boundary Test Cases for Every Endpoint

## Scope
- /backend/tests/*.py
- /frontend/src/**/*.test.ts

## Rationale
- Current tests are strong for happy paths but sparse on invalid inputs and edge conditions, leaving contract regressions undetected.

## Standard & Guidelines
- Every endpoint must have tests for invalid query values, boundary conditions, and error status codes.
- For each new filter parameter, add at least one failing/invalid case.
- Frontend data utilities must include edge cases (empty arrays, malformed dates, zero denominators).

## Examples

### ❌ Incorrect (Don't)
```python
def test_metrics_summary_by_week_honors_business_type_filter():
    response = client.get(
        "/api/metrics/summary",
        params={"group_by": "week", "business_type": "B2C"},
    )
    assert response.status_code == 200
```

### ✅ Correct (Do)
```python
def test_top_categories_rejects_limit_above_max():
    response = client.get(
        "/api/metrics/categories/top",
        params={"operation_type": "outcome", "limit": 999},
    )
    assert response.status_code == 422
```
