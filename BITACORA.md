# BITÁCORA — Tienda Tech

Diario del proyecto: qué hacemos cada día, qué decidimos y por qué.
Sirve para no perder el contexto entre sesiones. **Se lee al empezar cada sesión y se actualiza al terminar cada paso.**

> Lo marcado con **(por confirmar)** lo he deducido de los archivos y falta que el equipo lo confirme.

---

## Estado actual (resumen rápido)

| | |
|---|---|
| **Fase actual** | **Fase 2 cerrada** (commit "fase 2" subido a GitHub el 2026-11-20). Siguiente: **Fase 3a — instalar MongoDB** (aún no empezada). |
| **Dónde viven los datos ahora** | En una lista dentro del backend (`backend/src/productos.controller.ts`), en la memoria del servidor. Al recargar la web se mantienen; al reiniciar el backend se pierden. |
| **Cómo arrancar lo que hay** | Dos terminales: (1) en `backend`: `npm run start` → espera "API lista en http://localhost:3000/productos". (2) en `frontend`: `npx http-server -p 8080` → abrir `http://localhost:8080` |
| **Pendientes / dudas abiertas** | Ver sección "Pendientes" al final |

### Recorrido de los datos hoy

```
Navegador (frontend, :8080)
   │  fetch → petición HTTP con JSON
   ▼
Backend NestJS (:3000)
   │  aplica las reglas
   ▼
Lista "productos" en la memoria del servidor
   │
   ▼
Backend → respuesta JSON → Navegador actualiza el listado
```

---

## Registro por días

### 2026-11-19 — Fase 0 y Fase 1

**Fase 0 — Entorno** (por confirmar: se hizo este mismo día)
- Se comprobó que Node.js y npm están instalados y responden con su versión. No se instaló nada.

**Fase 1 — Frontend simple**
- Se creó la carpeta `frontend/` con 3 archivos:
  - `index.html`: la estructura de la página → un formulario (sirve para crear y para editar) y una tabla con el listado.
  - `styles.css`: el aspecto (cajas blancas, formulario en dos columnas, botones de colores).
  - `app.js`: la lógica y los datos → CRUD completo sobre una lista en memoria.
- Productos de ejemplo con los que arranca la lista: MacBook Air (Apple), Galaxy S24 (Samsung), WH-1000XM5 (Sony).
- Se sirvió la web con `npx http-server` en el puerto 8080.
- Comprobación: crear, editar y borrar funciona; al recargar la página, los cambios se pierden (es lo esperado en esta fase).
- Glosario ampliado en `CLAUDE.md` con: Node.js, npm, npx, Servidor, localhost (por confirmar).

**Decisiones tomadas**
| Decisión | Por qué |
|---|---|
| Un solo formulario para crear y editar (cambia el título y el botón; aparece "Cancelar" al editar) | Menos código y menos piezas que entender |
| El listado se muestra como una tabla con botones "Editar" y "Borrar" en cada fila | Se ven todos los campos de un vistazo |
| Borrar pide confirmación ("¿Seguro que quieres borrar…?") | Evitar borrados por error |
| En la fase 1, el `_id` se genera con la hora actual (`Date.now()`) | Es la forma más sencilla de tener un identificador único; en la fase 3 lo generará MongoDB |
| Si el stock se deja vacío, vale 0 | Lo pide el modelo de producto (stock por defecto 0) |
| Las reglas (campos obligatorios, precio y stock ≥ 0, categoría de lista cerrada) se controlan con el propio formulario HTML | Es lo más sencillo; en la fase 2 el backend aplicará también las reglas |
| El precio se muestra con el símbolo € | Claridad para quien usa la web |

**Idea aprendida:** el frontend es lo que ve y usa la persona; por sí solo no guarda nada de forma duradera.

### 2026-11-20 — Organización (sin cambios en la aplicación)

- Se creó `BITACORA.md` para llevar el control diario del proyecto y no perder contexto. Se reconstruyó lo hecho el 19/11 a partir de los archivos del frontend.
- Se modificó `CLAUDE.md` (con permiso del equipo):
  - Sección 6: se añade `BITACORA.md` a la estructura de carpetas.
  - Sección 7: nueva regla 9 → leer la bitácora al empezar cada sesión y actualizarla al terminar cada paso.

**Decisiones tomadas**
| Decisión | Por qué |
|---|---|
| El archivo se llama `BITACORA.md` y está en la raíz del proyecto | Nombre claro en castellano, junto a `CLAUDE.md` |
| La regla de usar la bitácora se escribe en `CLAUDE.md` | `CLAUDE.md` se lee siempre al empezar; así la bitácora no se olvida en sesiones nuevas |

**Git en el proyecto (a petición del equipo)**
- Error encontrado: Git no estaba instalado (`xcode-select: error: Unable to get active developer directory`). Significa que faltaban las Command Line Tools de Apple, que incluyen Git.
- Solución (aprobada por el equipo): `xcode-select --install` → el equipo pulsó "Instalar" en la ventana de Apple. Instalación en el sistema, fuera del proyecto.
- Se creó `.gitignore` (ignora `.DS_Store` y `node_modules/`).
- `git init` en la carpeta del proyecto + autor configurado **solo para este proyecto**: david orozco / davidorozcox@gmail.com.
- Primer commit: **`fase 1`** (frontend, `CLAUDE.md`, `BITACORA.md`, `.gitignore`).
- `CLAUDE.md` actualizado: Git sale de "fuera de alcance"; glosario ampliado (Git, repositorio, commit, .gitignore, Command Line Tools).

| Decisión | Por qué |
|---|---|
| Un commit al cerrar cada fase, con título `fase N` | Tener una "foto" de cada fase a la que poder volver |
| Autor configurado solo en el proyecto, no en todo el Mac | No tocar nada fuera de la carpeta del proyecto |
| Sin GitHub ni repositorios remotos | Todo es local; se añadirá solo si el equipo lo pide |
| Al crear NestJS se usará `--skip-git` | Evitar un segundo repositorio dentro de `backend/` |

**Conexión con GitHub (a petición del equipo)**
- Repositorio: https://github.com/davidorozcox-png/DEL_PRUEBACIFO01 (público, estaba vacío).
- `git remote add origin …` → el proyecto conoce su copia en GitHub con el nombre `origin`.
- Autenticación: token "classic" de GitHub con permiso `repo`, 90 días. Se guardó en el Llavero de macOS con `git credential approve` (no queda en ningún archivo del proyecto).
- `git push -u origin main` → commit "fase 1" subido. A partir de ahora basta con `git push`.

| Decisión | Por qué |
|---|---|
| Se usa el email real (davidorozcox@gmail.com) en los commits, no el anónimo de GitHub | Decisión del equipo; se sabe que será visible al ser público |
| Autenticación con token por HTTPS (sin instalar `gh` ni Homebrew) | No requiere instalar nada más |
| El token se pegó en el chat y Claude hizo el push | Decisión del equipo (entorno de clase). Recomendado: borrar ese token en GitHub al acabar el curso o si deja de ser de clase |

**Cierre de la fase 1 (revisado antes de la pausa)**
- Comprobado: frontend con CRUD completo, commit "fase 1" hecho y subido a GitHub, rama local igual que la de GitHub → **fase 1 cerrada**.
- Los cambios de documentación de hoy (`CLAUDE.md`, `BITACORA.md`) irán en el commit "fase 2", según la regla de un commit por fase.

### 2026-11-20 — Fase 2 (hecha por Claude durante la pausa, a petición del equipo)

El equipo pidió: "asegúrate de que la fase 1 está cerrada y sigue con la fase 2" mientras estaba en la pausa. Por eso estos pasos **no se explicaron uno a uno antes de hacerlos**; aquí queda todo explicado para repasarlo juntos.

**Fase 2a — Crear la API**
- Comando: `npx @nestjs/cli new backend --skip-git --package-manager npm` (sin instalaciones globales). Versión creada: NestJS 12, con TypeScript.
  - Node v26.13.1, npm 11.20.0.
- La herramienta añadió cosas que no hacen falta y **se borraron**: carpetas `.agents/` y `.claude/` y el archivo `AGENTS.md` (instrucciones para asistentes de IA), la carpeta `test/` y los archivos de tests (fuera de alcance), y el controlador de ejemplo "Hello World" (`app.controller.ts`, `app.service.ts`).
- Archivos del backend que importan (en `backend/src/`):
  - `main.ts`: arranca el servidor en el puerto 3000 y activa CORS para `http://localhost:8080`.
  - `app.module.ts`: le dice a NestJS qué controladores tiene la API.
  - `productos.controller.ts` (**nuevo**): la lista de productos en memoria, las 5 rutas y las reglas del modelo.
- Comprobado con `curl` desde la terminal: los 5 endpoints responden; un `_id` que no existe da error **404**; datos incorrectos dan error **400** con la lista de errores en castellano; la cabecera CORS solo da permiso a `http://localhost:8080`.

**Fase 2b — Conectar frontend y backend**
- Solo cambió `frontend/app.js`: ya no tiene la lista de productos; usa `fetch` para pedir y enviar datos a `http://localhost:3000/productos`. `index.html` y `styles.css` no cambian.
- Si la API responde con error, la web muestra el mensaje en una alerta. Si el backend está apagado, avisa: "No se puede conectar con la API…".
- **CORS** (explicación): la web vive en `localhost:8080` y la API en `localhost:3000`. Para el navegador son "sitios distintos", y por seguridad no deja que una web lea datos de otro sitio salvo que ese servidor lo permita. El backend lo permite solo para `http://localhost:8080` con `app.enableCors(...)`. Antes de un PATCH o DELETE, el navegador manda una petición previa de permiso (*preflight*, método OPTIONS); se comprobó que el backend la responde bien.
- Se añadió `dist/` al `.gitignore`.
- Al terminar se pararon los dos servidores (puertos libres) para que el equipo arranque desde cero.

**Decisiones tomadas por Claude (revisables por el equipo)**
| Decisión | Por qué | Alternativa |
|---|---|---|
| Un solo archivo `productos.controller.ts` con lista, rutas y reglas | Menos archivos; se ve todo en un sitio | Lo típico en NestJS es separar en controlador + servicio + módulo (3 archivos) |
| Reglas comprobadas "a mano" con una función `validar` | No añade librerías | NestJS suele usar las librerías `class-validator` y `class-transformer` |
| El `_id` lo genera el backend con la hora (`Date.now()`) | Igual que en la fase 1; en la fase 3 lo generará MongoDB | Un contador 1, 2, 3… |
| El backend arranca con los mismos 3 productos de ejemplo | Así se ve algo nada más abrir la web | Empezar con la lista vacía |
| PATCH solo cambia los campos que llegan y no deja cambiar el `_id` | Es lo que significa "editar" (PATCH) | — |
| Se usó `npm run start` (sin recarga automática) | Más sencillo de entender: arrancar = un comando | `npm run start:dev` reinicia solo al guardar cambios |

**Idea que se aprende:** el backend recibe peticiones, aplica las reglas y responde con datos; frontend y backend son programas distintos que se comunican por HTTP.

**Cierre de la fase 2**
- El equipo aprobó cerrar la fase ("sí, termina la fase 2").
- Se añadió `*.tsbuildinfo` al `.gitignore` (otro archivo generado al compilar).
- Commit **"fase 2"** (backend, `frontend/app.js`, `.gitignore`, `CLAUDE.md`, `BITACORA.md`) y `git push` a GitHub.

---

## Pendientes

- **Comprobación de la fase 2 por el equipo en el navegador**, si aún no se ha hecho (ver "Cómo arrancar lo que hay" arriba):
  1. Crear, editar y borrar productos en la web.
  2. Recargar la página → los cambios **se mantienen**.
  3. Parar el backend (Ctrl + C en su terminal) y volver a arrancarlo → los cambios **se pierden**.
  4. Probar un endpoint en el navegador: abrir `http://localhost:3000/productos` → se ve el JSON.
- Revisar las "decisiones tomadas por Claude" de la fase 2 y confirmarlas o cambiarlas.
- Confirmar los puntos marcados con **(por confirmar)** del 19/11.
- Siguiente fase: **Fase 3a — instalar MongoDB** (se explicará y se esperará aprobación; requiere instalar en el sistema).

---

## Cómo se actualiza esta bitácora

- Cada día nuevo empieza con su fecha (`### AAAA-MM-DD — qué fase`).
- Al terminar cada paso se anota: qué se hizo, qué archivos cambiaron, qué comandos se usaron, cómo se comprobó y qué decisiones se tomaron (con su porqué).
- Los errores que aparezcan también se anotan: qué pasó, qué significaba y cómo se resolvió.
- Se actualiza la tabla "Estado actual" para que siempre refleje dónde estamos.
