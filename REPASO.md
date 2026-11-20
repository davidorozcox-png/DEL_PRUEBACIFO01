# REPASO — Tienda Tech (Fase 4)

Recorrido completo de una petición real, pieza por pieza. Los datos de este documento **no son inventados**: salen de la prueba hecha el 2026-11-20 con las tres piezas arrancadas.

---

## 1. Las tres piezas de un vistazo

| Pieza | Programa | Dirección | Su trabajo | Dónde está |
|---|---|---|---|---|
| **Frontend** | `http-server` | `http://localhost:8080` | Mostrar la web y recoger lo que hace la persona | `frontend/` (3 archivos) |
| **Backend** | NestJS (Node.js) | `http://localhost:3000` | Recibir peticiones, aplicar las reglas y hablar con la base de datos | `backend/src/` (5 archivos) |
| **Base de datos** | MongoDB (`mongod`) | `127.0.0.1:27017` | Guardar los productos de forma permanente | `mongodb/` (programa y datos) |

Son **tres programas distintos**, cada uno en su puerto. Se hablan entre sí con mensajes:
- el frontend y el backend hablan **HTTP con JSON**;
- el backend y MongoDB hablan el "idioma" de MongoDB, a través de **Mongoose**.

```
  PERSONA
     │  rellena el formulario y pulsa "Crear producto"
     ▼
┌──────────────────────────┐
│ FRONTEND  (:8080)        │  index.html + styles.css + app.js
│ en el navegador          │
└──────────────────────────┘
     │  fetch → POST /productos  (JSON)        ▲  respuesta 201 + JSON
     ▼                                         │
┌──────────────────────────┐                   │
│ BACKEND  NestJS (:3000)  │  productos.controller.ts + producto.schema.ts
│ reglas + rutas           │
└──────────────────────────┘
     │  Mongoose → guardar documento           ▲  documento guardado con _id
     ▼                                         │
┌──────────────────────────┐                   │
│ MONGODB  (:27017)        │  base tienda_tech → colección productos
│ guarda en disco          │  (archivos en mongodb/datos/)
└──────────────────────────┘
```

---

## 2. El viaje de un producto, paso a paso

Ejemplo: crear el producto **"Monitor UltraFine 27"** de LG.

### Paso A — El navegador pide la web
- Al abrir `http://localhost:8080`, el navegador pide los archivos a `http-server`.
- Respuesta: `HTTP 200` y los archivos `index.html` (2047 bytes), `styles.css` y `app.js`.
- **Idea:** `http-server` solo **entrega archivos**. No sabe nada de productos.

### Paso B — La web pide la lista de productos
- Al cargar, `app.js` hace `fetch` a `GET http://localhost:3000/productos`.
- El backend se la pide a MongoDB y responde con JSON:
  ```json
  [{"_id":"6b003592222159c1f4f1a9d7","nombre":"MacBook Air","marca":"Apple","categoria":"portátil","precio":1199,"stock":5,"descripcion":""}, …]
  ```
- `app.js` convierte ese JSON en las filas de la tabla.
- **Idea:** la web **no tiene datos propios**. Cada vez que se carga, los pide.

### Paso C — El permiso CORS (preflight)
- La web (`:8080`) y la API (`:3000`) son "sitios distintos" para el navegador. Antes de enviar el producto, el navegador pregunta por su cuenta: *"¿puede `localhost:8080` enviarte un POST?"*. Esa pregunta es una petición `OPTIONS`.
- Respuesta del backend:
  ```
  HTTP/1.1 204 No Content
  Access-Control-Allow-Origin: http://localhost:8080
  Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
  ```
- **Idea:** el permiso lo da el **backend** (en `main.ts`) y lo hace cumplir el **navegador**.

### Paso D — Crear el producto
- La persona rellena el formulario y pulsa **"Crear producto"**. `app.js` lee los campos y envía:
  ```
  POST http://localhost:3000/productos
  Content-Type: application/json

  {"nombre":"Monitor UltraFine 27","marca":"LG","categoria":"monitor","precio":549.9,"stock":4,"descripcion":"Producto creado en el repaso de la fase 4"}
  ```
- **En el backend:**
  1. NestJS ve `POST /productos` y lo envía a la función `crear` de `productos.controller.ts`.
  2. Mongoose comprueba el producto con las reglas de `producto.schema.ts`: ¿tiene nombre y marca? ¿la categoría está en la lista? ¿el precio es ≥ 0?
  3. Si todo está bien, Mongoose lo manda a MongoDB.
- **En MongoDB:** guarda el documento en la colección `productos` y le pone un `_id` único: `6b003592222159c1f4f1a9da`.
- **Vuelta:** el backend responde `HTTP/1.1 201 Created` con el producto ya guardado (incluido su `_id`). `app.js` vacía el formulario y vuelve a pedir la lista (paso B), así que el monitor aparece en la tabla.

### Paso E — Comprobar que está en la base de datos
Mirando **directamente** en MongoDB, sin pasar por el backend:
```
bases de datos: admin, config, local, tienda_tech
colecciones en tienda_tech: productos
número de documentos: 4
documento del monitor: {"_id":"6b003592222159c1f4f1a9da","nombre":"Monitor UltraFine 27","marca":"LG", …}
```
- `admin`, `config` y `local` son bases internas de MongoDB. La nuestra es **`tienda_tech`**.
- Ese documento está en los archivos de `mongodb/datos/`. Por eso sobrevive aunque se apague todo.

### Paso F — ¿Y si los datos son incorrectos?
- Se envió un producto con `"precio": -10`.
- El backend respondió `HTTP/1.1 400 Bad Request` con `{"message":["precio debe ser mayor o igual que 0"]}`.
- Después seguía habiendo **4 productos**: el incorrecto **no llegó a guardarse**.
- **Idea:** las reglas viven en el **backend**. Aunque alguien se salte el formulario de la web (como en esta prueba, hecha desde la terminal), el backend no deja pasar datos incorrectos.

---

## 3. Qué hace cada pieza (resumen)

| Pieza | Hace | NO hace |
|---|---|---|
| **Frontend** | Muestra la web, recoge lo que escribe la persona, envía peticiones con `fetch` y pinta las respuestas | No guarda nada de forma duradera; no decide si un dato es válido (solo ayuda con el formulario) |
| **Backend** | Ofrece las 5 rutas (la API), aplica las reglas, habla con la base de datos y responde con JSON y un código (200, 201, 400, 404) | No dibuja la web; no guarda los datos él mismo (desde la fase 3) |
| **Base de datos** | Guarda los documentos en disco, les da un `_id` y los devuelve cuando se le piden | No habla con el navegador: **solo el backend** habla con ella |

### Dónde vivían los datos en cada fase

| Fase | Dónde | ¿Sobrevive a recargar la web? | ¿Sobrevive a reiniciar el backend? |
|---|---|---|---|
| 1 | Lista en `app.js` (navegador) | ❌ | — (no había backend) |
| 2 | Lista en el backend (memoria del servidor) | ✅ | ❌ |
| 3 | MongoDB (`mongodb/datos/`) | ✅ | ✅ (y también a reiniciar MongoDB o el Mac) |

---

## 4. Preguntas para practicar

Intentad responder con vuestras palabras antes de mirar la respuesta.

<details><summary><b>1. ¿Por qué hay que arrancar MongoDB antes que el backend?</b></summary>

Porque al arrancar, el backend se conecta a MongoDB (y carga los ejemplos si la colección está vacía). Si MongoDB no está encendido, el backend no tiene dónde guardar ni de dónde leer.
</details>

<details><summary><b>2. Si apagamos solo el backend, ¿qué pasa en la web?</b></summary>

La web se sigue viendo (la entrega `http-server`), pero no puede pedir ni guardar productos: aparece el aviso "No se puede conectar con la API…". Los datos no se pierden: están en MongoDB.
</details>

<details><summary><b>3. ¿Puede el navegador hablar directamente con MongoDB?</b></summary>

No. Solo el backend habla con la base de datos. El navegador habla con el backend por HTTP, y el backend decide qué se guarda y qué no.
</details>

<details><summary><b>4. ¿Para qué sirve CORS?</b></summary>

Es una regla de seguridad del navegador: una web solo puede pedir datos a otro "sitio" (otro puerto u otro dominio) si ese servidor lo permite. Nuestro backend solo da permiso a `http://localhost:8080`.
</details>

<details><summary><b>5. ¿Quién genera el `_id` de un producto?</b></summary>

MongoDB, al guardar el documento. Por eso el frontend no lo envía al crear: lo recibe en la respuesta.
</details>

<details><summary><b>6. ¿Qué significa recibir un 400? ¿Y un 404?</b></summary>

400: los datos enviados no cumplen las reglas (por ejemplo, precio negativo). 404: el producto pedido no existe (por ejemplo, un `_id` que no está en la base de datos).
</details>

<details><summary><b>7. ¿Por qué no cambió el frontend al pasar de la fase 2 a la fase 3?</b></summary>

Porque el contrato de la API (rutas, campos y JSON) se mantuvo igual. El frontend solo conoce la API; no sabe ni le importa dónde guarda los datos el backend.
</details>

<details><summary><b>8. ¿Qué hace cada una de las 5 rutas?</b></summary>

`GET /productos` lista todos · `GET /productos/:id` muestra uno · `POST /productos` crea · `PATCH /productos/:id` edita · `DELETE /productos/:id` borra.
</details>

---

## 5. Arrancar y parar todo

**Arrancar** (3 ventanas de Terminal, en este orden):
1. `cd ~/Documents/proyectos/actividad01` → `./mongodb/bin/mongod --dbpath mongodb/datos --bind_ip 127.0.0.1 --port 27017`
2. `cd ~/Documents/proyectos/actividad01/backend` → `npm run start` (esperar "API lista…")
3. `cd ~/Documents/proyectos/actividad01/frontend` → `npx http-server -a 127.0.0.1 -p 8080` → abrir `http://localhost:8080`

Las tres piezas solo aceptan conexiones **desde este Mac** (`127.0.0.1`). Otros ordenadores de la red de clase no pueden entrar.

**Parar:** pulsar **Ctrl + C** en cada ventana, en orden inverso (web, backend, MongoDB).
