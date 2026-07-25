# Engineering Practices Analysis & Standards Proposal - Financial Dashboard

## 1. Overview
- El repositorio presenta una base tecnica solida para un dashboard full-stack pequeno: tipado fuerte, separacion razonable de responsabilidades y cobertura de pruebas funcionales en backend y utilidades frontend.
- Tambien se observan riesgos relevantes para escalar a produccion: configuraciones inseguras por defecto, duplicacion de logica en endpoints, manejo de errores limitado en cliente y ausencia de persistencia/capa de datos formal.
- La calidad global es buena para un entorno educativo o prototipo, pero requiere reglas de gobierno para evitar deuda tecnica al crecer.

## 2. Good Engineering Practices Identified (At least 5)
Categoriza cada buena practica encontrada en el codigo base indicando la evidencia explicita:
- **[Arquitectura/API] Contratos HTTP tipados con modelos de respuesta:** Los endpoints declaran response_model y tipos de dominio, reduciendo ambiguedad entre backend y frontend.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (backend/app/routes.py).

- **[Tipo y Validacion] Uso de tipos restringidos y validacion de query params:** Se usan Literal para dominios cerrados y Query con restricciones (ge/le) para validar entrada en runtime.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (backend/app/routes.py).

- **[Testing] Pruebas de endpoints y reglas de filtrado:** Existe suite que cubre salud del servicio, filtros, facetas, resumen y comparativas.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (backend/tests/test_routes.py).

- **[Frontend Architecture] Logica de negocio desacoplada de la vista:** El calculo de KPIs y agregados mensuales vive en utilidades puras, no embebido en componentes.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (frontend/src/lib/financial-utils.ts, frontend/src/App.tsx).

- **[Frontend Testing] Cobertura de utilidades criticas de transformacion y formato:** Hay tests unitarios para computeKPIs, computeMonthlyData y formatters.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (frontend/src/lib/financial-utils.test.ts).

- **[DX/Calidad] Tooling estricto de lint y TypeScript:** ESLint y TS config activan reglas de calidad (unused locals/params, fallthrough, config recomendadas).
- *Evidencia:* Ubicacion/archivo exacto donde se observa (frontend/eslint.config.js, frontend/tsconfig.app.json, frontend/tsconfig.node.json).

- **[DX/Config] Alias de imports y proxy de desarrollo:** Alias @ mejora mantenibilidad y el proxy de Vite simplifica consumo de /api en desarrollo.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (frontend/vite.config.ts).

## 3. Bad or Risky Engineering Practices Identified (At least 5)
Categoriza cada mala practica o riesgo detectado en el codigo base:
- **[Seguridad/Configuracion] CORS completamente abierto con credenciales habilitadas:** allow_origins=["*"] junto con allow_credentials=True es una combinacion insegura para produccion.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (backend/app/main.py).

- **[Concurrencia/Determinismo] Mutacion de estado global de random en requests:** generate_mock_movements usa random.seed(seed) en cada invocacion, afectando el estado global del RNG del proceso.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (backend/app/routes.py).

- **[Arquitectura] Duplicacion de logica en endpoints segmentados:** /api/metrics/b2b y /api/metrics/b2c repiten casi el mismo flujo; esto incrementa costo de mantenimiento.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (backend/app/routes.py).

- **[Manejo de Errores UX] Error handling generico en frontend:** El catch de fetch descarta detalles del error y muestra un unico mensaje fijo, dificultando diagnostico.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (frontend/src/App.tsx).

- **[Arquitectura/Producto] Desalineacion entre UI y datos reales:** La UI fija periodo 2024 - Full Year, mientras backend genera fechas relativas al dia actual.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (frontend/src/App.tsx, backend/app/routes.py).

- **[Escalabilidad/API] Endpoint principal sin paginacion ni limites de respuesta:** /api/metrics retorna todo el dataset filtrado, patron riesgoso para crecimiento de volumen.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (backend/app/routes.py).

- **[Testing] Cobertura parcial de escenarios negativos y errores HTTP:** Se validan casos exitosos principalmente; faltan pruebas sistematicas para entradas invalidas y errores esperados.
- *Evidencia:* Ubicacion/archivo exacto donde se observa (backend/tests/test_routes.py).

## 4. Proposed Repository Rule Set
Borrador estructurado de las reglas propuestas para mitigar los riesgos y estandarizar el desarrollo futuro:
- **Regla 1:** Definir politica CORS por entorno y prohibir wildcard con credenciales en produccion.
Ambito de aplicacion (scope): backend/app/main.py y configuracion de despliegue.
Justificacion tecnica: reduce superficie de ataque y evita exponer cookies/tokens a origenes no autorizados.

- **Regla 2:** Prohibir estado global mutable en rutas HTTP; usar objetos RNG locales o proveedores inyectables.
Ambito de aplicacion (scope): backend/app/routes.py y nueva capa de servicios.
Justificacion tecnica: evita efectos colaterales entre requests y mejora testabilidad/concurrencia.

- **Regla 3:** Consolidar logica repetida de endpoints en funciones de servicio reutilizables.
Ambito de aplicacion (scope): backend/app/routes.py.
Justificacion tecnica: disminuye duplicacion, facilita cambios y reduce riesgo de regresiones divergentes.

- **Regla 4:** Estandarizar manejo de errores frontend con clasificacion por tipo (network, timeout, HTTP, parseo) y mensajes observables.
Ambito de aplicacion (scope): frontend/src/App.tsx y cualquier capa futura de API client.
Justificacion tecnica: mejora trazabilidad, soporte y experiencia de usuario.

- **Regla 5:** No hardcodear periodos de negocio en UI; derivarlos de datos o parametros del backend.
Ambito de aplicacion (scope): frontend/src/App.tsx y componentes de cabecera.
Justificacion tecnica: mantiene consistencia semantica entre visualizacion y dataset real.

- **Regla 6:** Introducir convencion de paginacion para endpoints de colecciones (limit/offset o cursor).
Ambito de aplicacion (scope): backend/api de metricas y consumidores frontend.
Justificacion tecnica: habilita escalabilidad y previene respuestas excesivas.

- **Regla 7:** Exigir pruebas de casos negativos por endpoint (validacion, ranges invalidos, combinaciones no soportadas).
Ambito de aplicacion (scope): backend/tests y frontend tests de capa de datos.
Justificacion tecnica: fortalece contratos API y detecta regresiones en manejo de errores.

- **Regla 8:** Preservar tipado estricto y contratos compartidos entre cliente y servidor como requisito de merge.
Ambito de aplicacion (scope): frontend/src/lib/financial-types.ts, backend/app/routes.py, pipeline CI.
Justificacion tecnica: mantiene coherencia de datos, reduce bugs de integracion y acelera refactors seguros.
