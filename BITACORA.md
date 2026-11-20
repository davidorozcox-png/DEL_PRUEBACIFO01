# BITÁCORA — Tienda Tech

Diario del proyecto: qué hacemos cada día, qué decidimos y por qué.
Sirve para no perder el contexto entre sesiones. **Se lee al empezar cada sesión y se actualiza al terminar cada paso.**

> Lo marcado con **(por confirmar)** lo he deducido de los archivos y falta que el equipo lo confirme.

---

## Estado actual (resumen rápido)

| | |
|---|---|
| **Fase actual** | **Fase 4 cerrada** (commit "fase 4" subido a GitHub el 2026-11-20). **Todas las fases del proyecto están terminadas.** Queda: que el equipo responda las preguntas de `REPASO.md` con sus palabras. |
| **Dónde viven los datos ahora** | En **MongoDB** (base `tienda_tech`, colección `productos`), cuyos archivos están en `mongodb/datos/`. Sobreviven a recargar la web y a reiniciar el backend. |
| **Cómo arrancar lo que hay** | Tres terminales, **en este orden**: (0) en la carpeta del proyecto: `./mongodb/bin/mongod --dbpath mongodb/datos --bind_ip 127.0.0.1 --port 27017` → se queda en marcha. (1) en `backend`: `npm run start` → espera "API lista en http://localhost:3000/productos". (2) en `frontend`: `npx http-server -a 127.0.0.1 -p 8080` → abrir `http://localhost:8080`. Para parar cada uno: Ctrl + C en su terminal. Las 3 piezas solo aceptan conexiones desde este Mac. |
| **Pendientes / dudas abiertas** | Ver sección "Pendientes" al final |

### Recorrido de los datos hoy

```
Navegador (frontend, :8080)
   │  fetch → petición HTTP con JSON
   ▼
Backend NestJS (:3000)
   │  Mongoose → comprueba las reglas (esquema) y hace la consulta
   ▼
MongoDB (:27017, base tienda_tech, colección productos)
   │  resultado
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

### 2026-11-20 — Fase 3a: instalar y arrancar MongoDB

**Comprobaciones previas:** Homebrew no instalado; Mac con Apple Silicon (arm64), macOS 15.5; MongoDB no instalado; puerto 27017 libre; **el usuario del Mac no es administrador** (no puede instalar Homebrew sin la contraseña de un administrador).

**Opciones presentadas al equipo**
| Opción | Ventajas | Inconvenientes |
|---|---|---|
| **MongoDB dentro del proyecto** ✅ elegida | Sin contraseña ni administrador; no toca el sistema; para quitarlo basta con borrar la carpeta | Hay que arrancarlo a mano con un comando cada vez |
| Homebrew (lo que preveía `CLAUDE.md`) | Puede arrancar solo con el Mac | Necesita un administrador; instala en el sistema |
| Preguntar al profesor | — | Paraba el trabajo |

**Qué se hizo**
1. Se consultó la lista oficial de versiones (`downloads.mongodb.org/full.json`) → última estable para Mac arm64: **MongoDB 9.0.8**.
2. Se añadió `mongodb/` al `.gitignore` (el programa y los datos no se suben a GitHub).
3. Descarga desde `fastdl.mongodb.org` a una carpeta temporal y **comprobación de la huella SHA-256** → coincide (archivo original).
4. Se copió el programa a `mongodb/bin/mongod` (≈377 MB) y se creó `mongodb/datos/` para los datos.
5. Arranque: `./mongodb/bin/mongod --dbpath mongodb/datos --bind_ip 127.0.0.1 --port 27017`.
   - `--dbpath`: dónde se guardan los datos (dentro del proyecto).
   - `--bind_ip 127.0.0.1`: solo acepta conexiones de este Mac, no de la red de clase.
6. Comprobado: MongoDB escucha en `localhost:27017` y ha creado sus archivos en `mongodb/datos/`.

**Decisiones**
| Decisión | Por qué |
|---|---|
| No se instala `mongosh` (la consola de MongoDB) ni Compass (programa visual) | No son imprescindibles: el backend habla con MongoDB y los datos se ven por la API. Se pueden añadir si el equipo quiere "mirar dentro" de la base de datos |
| La base `tienda_tech` y la colección `productos` no se crean a mano | MongoDB las crea solas la primera vez que el backend guarde un producto |

### 2026-11-20 — Fase 3b: conectar el backend a MongoDB

- Aprobado por el equipo, incluida la carga de productos de ejemplo.
- Comando (en `backend/`): `npm install mongoose @nestjs/mongoose` → Mongoose 9.12.2 y @nestjs/mongoose 12.0.1.
- Archivos (todos en `backend/src/`; **el frontend no cambia**):
  - `producto.schema.ts` (**nuevo**): el **esquema**, es decir, la forma de un producto y sus reglas (obligatorios, categoría de la lista, precio ≥ 0, stock entero ≥ 0 y por defecto 0), con mensajes en castellano.
  - `app.module.ts`: conexión a `mongodb://127.0.0.1:27017/tienda_tech` y registro del modelo `Producto`.
  - `productos.controller.ts`: la lista en memoria desaparece; cada ruta consulta MongoDB a través del modelo. La función `validar` de la fase 2 desaparece: ahora las reglas las aplica el esquema.
- El `_id` ya lo genera MongoDB (texto de 24 caracteres, p. ej. `6b002f58f9bde09da73567ae`). El frontend no ha tenido que cambiar porque el campo siempre se llamó `_id`.
- Comprobado con `curl`: los 5 endpoints funcionan; `_id` inexistente → 404; datos incorrectos → 400 con mensajes en castellano; CORS sigue activo.
- **Prueba clave:** se creó, editó y borró un producto, se **reinició el backend** y los cambios **seguían ahí**.
- Después se borraron los productos de prueba (la próxima vez que arranque el backend, se cargan los 3 de ejemplo) y se pararon MongoDB, backend y web.

**Avisos que dio npm (explicados)**
- "5 vulnerabilities": `npm audit` muestra que están **solo en herramientas de desarrollo** (las que compilan el código), no en lo que usa la aplicación (`npm audit --omit=dev` → 0 vulnerabilidades). Como todo funciona solo en este Mac, no hay riesgo real. **No se aplicó** `npm audit fix --force` porque puede romper NestJS.
- "install scripts not yet covered by allowScripts: fsevents": npm avisa de que un paquete (para vigilar cambios de archivos en Mac) quiere ejecutar un script de instalación y no se le ha dado permiso. No hace falta: todo funciona igual.

**Decisiones**
| Decisión | Por qué | Alternativa |
|---|---|---|
| Esquema escrito con `new Schema({...})` de Mongoose | Se lee como una tabla de campos y reglas | El estilo típico de NestJS con decoradores (`@Schema`, `@Prop`) |
| Para editar: buscar el producto, cambiar campos y guardar (`save`) | Así se comprueban **todas** las reglas también al editar | `findByIdAndUpdate`, que no comprueba bien los obligatorios |
| Los 3 productos de ejemplo se cargan solo si la colección está vacía | Ver algo al abrir la web sin duplicar datos | Empezar vacía |

**Cierre de la fase 3**
- El equipo aprobó cerrar la fase ("sí").
- Commit **"fase 3"** (backend con Mongoose, `.gitignore`, `CLAUDE.md`, `BITACORA.md`) y `git push` a GitHub. La carpeta `mongodb/` (programa y datos) no se sube.

### 2026-11-20 — Fase 4: Repaso

- Se propuso hacerlo paso a paso con el equipo; el equipo pidió: **"genéralo todo tú"**.
- Claude arrancó las 3 piezas en orden (MongoDB → backend → web) y siguió una petición real de principio a fin:
  - A. GET de la web (`http-server`, 200).
  - B. GET `/productos`: los 3 ejemplos, que se cargaron solos en MongoDB al arrancar con la colección vacía.
  - C. Preflight CORS (`OPTIONS`, 204, permiso para `localhost:8080`).
  - D. POST del producto "Monitor UltraFine 27" (LG) → **201 Created**, `_id` `6b003592222159c1f4f1a9da`.
  - E. Comprobación **directa en MongoDB**, sin pasar por el backend: base `tienda_tech`, colección `productos`, 4 documentos, el monitor está.
  - F. POST con precio negativo → **400**; no se guardó nada (siguen 4 productos).
- Todo quedó escrito en **`REPASO.md`** (nuevo): las 3 piezas, el viaje paso a paso con los datos reales, qué hace y qué no hace cada pieza, dónde vivían los datos en cada fase y 8 preguntas para practicar con sus respuestas.
- `CLAUDE.md`: se añade `REPASO.md` a la estructura de carpetas.
- El monitor de prueba **se dejó** en la base de datos, como ejemplo del repaso.
- Las 3 piezas **se dejaron arrancadas** para que el equipo pueda abrir `http://localhost:8080`.

**Observación (pendiente de decidir)**
- El backend (`:3000`) y `http-server` (`:8080`) escuchan en **todas las conexiones de red** del Mac, no solo en este Mac. Otros ordenadores de la red de clase podrían abrir la web o usar la API. MongoDB, en cambio, solo acepta conexiones de este Mac.
  - Opción 1: dejarlo así (cómodo para enseñarlo a otros en clase).
  - Opción 2: limitarlo a este Mac (`app.listen(3000, '127.0.0.1')` y `npx http-server -a 127.0.0.1 -p 8080`).
  - ✅ **Decisión del equipo: opción 2, limitar a este Mac.** Cambiado `backend/src/main.ts` y el comando de la web en `CLAUDE.md`, `REPASO.md` y esta bitácora.

**Cierre de la fase 4**
- El equipo aprobó cerrar la fase: commit **"fase 4"** (`REPASO.md`, `main.ts`, `CLAUDE.md`, `BITACORA.md`) y `git push` a GitHub.
- Sigue pendiente que el equipo responda las preguntas de `REPASO.md` con sus palabras.

---

## Pendientes

- **Comprobación de la fase 2 por el equipo en el navegador**, si aún no se ha hecho (ver "Cómo arrancar lo que hay" arriba):
  1. Crear, editar y borrar productos en la web.
  2. Recargar la página → los cambios **se mantienen**.
  3. Parar el backend (Ctrl + C en su terminal) y volver a arrancarlo → los cambios **se pierden**.
  4. Probar un endpoint en el navegador: abrir `http://localhost:3000/productos` → se ve el JSON.
- Revisar las "decisiones tomadas por Claude" de la fase 2 y confirmarlas o cambiarlas.
- Confirmar los puntos marcados con **(por confirmar)** del 19/11.
- **Comprobación de la fase 3 por el equipo en el navegador**, si aún no se ha hecho: arrancar las 3 piezas en orden; crear/editar/borrar en la web; parar el backend (Ctrl + C) y arrancarlo de nuevo → los productos **siguen ahí**. Extra: parar también MongoDB y volver a arrancarlo → siguen ahí (están en `mongodb/datos/`).
- **Fase 4:** leer `REPASO.md` y responder las 8 preguntas con vuestras palabras (es el objetivo de la fase: que el equipo sepa explicar cada pieza).

---

## Cómo se actualiza esta bitácora

- Cada día nuevo empieza con su fecha (`### AAAA-MM-DD — qué fase`).
- Al terminar cada paso se anota: qué se hizo, qué archivos cambiaron, qué comandos se usaron, cómo se comprobó y qué decisiones se tomaron (con su porqué).
- Los errores que aparezcan también se anotan: qué pasó, qué significaba y cómo se resolvió.
- Se actualiza la tabla "Estado actual" para que siempre refleje dónde estamos.
