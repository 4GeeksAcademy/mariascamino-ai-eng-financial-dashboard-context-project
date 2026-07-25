# Rule: No Global Mutable Random State in Request Flow

## Scope
- /backend/app/routes.py
- Any future backend service used by API endpoints

## Rationale
- Re-seeding the global random module inside request paths creates hidden coupling between calls and can break determinism under concurrency.

## Standard & Guidelines
- Do not call random.seed inside endpoint request flow.
- Use a local random.Random instance and pass it through helper functions.
- Keep deterministic behavior explicit through dependency injection (seed or RNG object).

## Examples

### ❌ Incorrect (Don't)
```python
def generate_mock_movements(seed: int | None = None) -> list[FinancialMovement]:
    if seed is not None:
        random.seed(seed)
    # ... uses global random afterwards
```

### ✅ Correct (Do)
```python
def generate_mock_movements(seed: int | None = None) -> list[FinancialMovement]:
    rng = random.Random(seed)
    today = date.today()
    movements: list[FinancialMovement] = []
    for month in range(1, 13):
        income_probability = rng.uniform(0.45, 0.7)
        for _ in range(30):
            movements.append(_build_movement(month, income_probability, today, rng))
    movements.sort(key=lambda item: item.create_date)
    return movements
```
