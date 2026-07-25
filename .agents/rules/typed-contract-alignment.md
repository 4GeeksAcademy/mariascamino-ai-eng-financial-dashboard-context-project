# Rule: Keep Frontend and Backend Data Contracts Synchronized

## Scope
- /backend/app/routes.py
- /frontend/src/lib/financial-types.ts
- Any API-consuming component in /frontend/src

## Rationale
- The project relies on strong typing; drift between backend response models and frontend types creates integration bugs that are avoidable.

## Standard & Guidelines
- Any change to backend response model fields must be mirrored in frontend types in the same PR.
- API responses must remain semantically aligned (names, value domains, nullability).
- Add or update tests when contracts change.

## Examples

### ❌ Incorrect (Don't)
```typescript
export interface FinancialMovement {
  create_date: string
  amount: number
  operation_type: "income" | "outcome"
  // missing backend field business_type
}
```

### ✅ Correct (Do)
```typescript
export interface FinancialMovement {
  create_date: string
  amount: number
  operation_type: "income" | "outcome"
  category: "suppliers" | "sales" | "operational" | "administrative" | "others"
  business_type: "B2B" | "B2C"
}
```
