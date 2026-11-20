# BITÁCORA — Tienda Tech

Diario del proyecto: qué hacemos cada día, qué decidimos y por qué.
Sirve para no perder el contexto entre sesiones. **Se lee al empezar cada sesión y se actualiza al terminar cada paso.**

> Lo marcado con **(por confirmar)** lo he deducido de los archivos y falta que el equipo lo confirme.

---

## Estado actual (resumen rápido)

| | |
|---|---|
| **Fase actual** | Fase 1 terminada. Siguiente: **Fase 2a — Crear la API con NestJS** (aún no empezada) |
| **Dónde viven los datos ahora** | En una lista dentro de `frontend/app.js`, en la memoria del navegador. Al recargar se pierden. |
| **Cómo arrancar lo que hay** | En la terminal, dentro de la carpeta `frontend`: `npx http-server -p 8080` y abrir `http://localhost:8080` |
| **Pendientes / dudas abiertas** | Ver sección "Pendientes" al final |

### Recorrido de los datos hoy

```
Navegador (frontend, :8080)
   │  la persona usa el formulario
   ▼
Lista "productos" dentro de app.js  ← vive solo en la memoria del navegador
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

---

## Pendientes

- Confirmar los puntos marcados con **(por confirmar)**.
- Añadir cualquier decisión o conversación de ayer que no aparezca aquí (el código no lo refleja todo).
- Próximo paso: **Fase 2a — crear la API con NestJS** (se explicará y se esperará aprobación antes de empezar).

---

## Cómo se actualiza esta bitácora

- Cada día nuevo empieza con su fecha (`### AAAA-MM-DD — qué fase`).
- Al terminar cada paso se anota: qué se hizo, qué archivos cambiaron, qué comandos se usaron, cómo se comprobó y qué decisiones se tomaron (con su porqué).
- Los errores que aparezcan también se anotan: qué pasó, qué significaba y cómo se resolvió.
- Se actualiza la tabla "Estado actual" para que siempre refleje dónde estamos.
