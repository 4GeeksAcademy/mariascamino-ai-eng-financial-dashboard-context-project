# Rule: Environment-Safe CORS Configuration

## Scope
- /backend/app/main.py
- Any backend runtime configuration that sets CORS behavior

## Rationale
- The current backend sets allow_origins with wildcard and enables credentials. This pattern is unsafe for production and can expose authenticated resources to unintended origins.

## Standard & Guidelines
- Define CORS origins by environment.
- In production, never use wildcard origins when credentials are enabled.
- Keep local development permissive only when explicitly gated by environment.
- Document allowed origins in deployment configuration.

## Examples

### ❌ Incorrect (Don't)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### ✅ Correct (Do)
```python
allowed_origins = [
    "https://dashboard.example.com",
    "https://admin.example.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["Authorization", "Content-Type"],
)
```
