# DESPLIEGUE — Tienda Tech en internet (Render + MongoDB Atlas + GitHub Actions)

Guía paso a paso para publicar la aplicación en internet con cuentas gratuitas.
Seguid los pasos **en orden**: cada uno necesita el anterior.

---

## 0. Qué vamos a montar

En el Mac teníamos 3 piezas. En internet son las mismas, pero cada una vive en un sitio:

| Pieza | En el Mac | En internet | Dirección en internet |
|---|---|---|---|
| Frontend (web) | `http-server`, puerto 8080 | **Render — Static Site** (gratis) | `https://del-pruebacifo01-web.onrender.com` |
| Backend (API) | NestJS, puerto 3000 | **Render — Web Service** (gratis) | `https://del-pruebacifo01-api.onrender.com` |
| Base de datos | `mongod`, puerto 27017 | **MongoDB Atlas** (gratis) | una dirección secreta `mongodb+srv://…` |

**¿Por qué Atlas y no Render para la base de datos?** Render no ofrece MongoDB. Atlas es el servicio oficial de la empresa de MongoDB y tiene un plan gratuito.

### Recorrido de los datos en internet

```
Navegador de cualquier persona
   │  abre https://del-pruebacifo01-web.onrender.com   → Render entrega index.html, styles.css, app.js
   │  fetch → https://del-pruebacifo01-api.onrender.com/productos
   ▼
Backend NestJS en Render
   │  Mongoose → dirección secreta MONGODB_URI
   ▼
MongoDB Atlas (base tienda_tech, colección productos)
```

### Cómo llega el código a internet (GitHub Actions)

```
git push (desde el Mac)
   ▼
GitHub guarda el commit
   ▼
GitHub Actions (archivo .github/workflows/desplegar.yml)
   │ 1. "comprobar": compila el backend en un ordenador de GitHub. Si falla → se para, no se publica nada roto.
   │ 2. "desplegar": avisa a Render con los "deploy hooks" (direcciones secretas)
   ▼
Render descarga el commit y publica la versión nueva del backend y de la web
```

### Archivos preparados (ya están en el proyecto)

| Archivo | Para qué sirve |
|---|---|
| `render.yaml` | "Blueprint": describe a Render las 2 piezas (backend y web) y sus ajustes |
| `.github/workflows/desplegar.yml` | La GitHub Action: comprobar y desplegar en cada `git push` |
| `backend/src/main.ts` | Usa el puerto que da Render, acepta conexiones de internet **solo en Render** y da permiso CORS a la web de Render |
| `backend/src/app.module.ts` | En Render se conecta a Atlas (variable `MONGODB_URI`); en el Mac, al MongoDB local |
| `frontend/app.js` | En Render llama a la API de Render; en el Mac, a `localhost:3000` |

En el Mac **todo sigue funcionando igual** que antes.

### Limitaciones del plan gratuito (conviene saberlas)

- **El backend se "duerme"** tras **15 minutos** sin visitas. La siguiente visita tarda **alrededor de 1 minuto** en responder mientras se despierta. Es normal: la web puede tardar en mostrar los productos la primera vez.
- 750 horas gratis al mes (suficiente para un servicio encendido todo el mes). Dormido no gasta horas.
- La web (Static Site) no se duerme.
- Atlas gratis: 512 MB de datos, de sobra para este proyecto.

---

## Paso 1 — Crear la base de datos en MongoDB Atlas

1. Entrad en **https://www.mongodb.com/cloud/atlas/register** y cread una cuenta (vale con la de Google).
2. Cuando pida crear un clúster (*cluster* = el servidor de base de datos):
   - Elegid el plan **Free** (también llamado **M0**).
   - Proveedor: **AWS**. Región: **Frankfurt (eu-central-1)**: es la misma zona que usaremos en Render y así responde más rápido.
   - Nombre: deja el que propone o pon `tienda-tech`.
   - Pulsad **Create Deployment**.
3. **Usuario de la base de datos** (Atlas lo pide justo después):
   - Username: `tienda_tech_app`
   - Password: pulsad **Autogenerate Secure Password** y **copiadla** a una nota privada.
   - Pulsad **Create Database User**.
4. **Acceso desde internet** (*Network Access*):
   - Menú izquierdo → **Security → Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**.
   - ¿Por qué "desde cualquier sitio"? Render gratis no tiene una dirección fija, así que no se puede poner solo la de Render. La protección es el usuario y la contraseña.
5. **Dirección de conexión**:
   - Menú izquierdo → **Database → Clusters** → botón **Connect** → **Drivers**.
   - Copiad la dirección que aparece. Se parece a:
     ```
     mongodb+srv://tienda_tech_app:<db_password>@tienda-tech.abc123.mongodb.net/?retryWrites=true&w=majority&appName=tienda-tech
     ```
   - Cambiadla así:
     - Sustituid `<db_password>` (con los `< >`) por la contraseña del punto 3.
     - Añadid **`tienda_tech`** justo después de `.mongodb.net/` (es el nombre de nuestra base de datos):
     ```
     mongodb+srv://tienda_tech_app:LA_CONTRASEÑA@tienda-tech.abc123.mongodb.net/tienda_tech?retryWrites=true&w=majority&appName=tienda-tech
     ```
   - Guardadla en la nota privada. Esta dirección es la **`MONGODB_URI`**.

⚠️ **La `MONGODB_URI` es secreta** (lleva la contraseña). **Nunca** la pongáis en un archivo del proyecto: el repositorio de GitHub es público. Solo se escribe en Render (paso 3).

---

## Paso 2 — Dar permiso al token para subir la GitHub Action

GitHub **no deja subir archivos de `.github/workflows/`** con un token que solo tiene el permiso `repo` (el que creamos). Hay que añadirle el permiso **`workflow`**. El token **no cambia**: no hay que volver a escribirlo.

1. Abrid **https://github.com/settings/tokens**.
2. Pulsad sobre el token **`Mac clase`**.
3. Marcad la casilla **`workflow`**.
4. Bajad y pulsad **Update token**.

Avisad a Claude cuando esté hecho: hará el commit con todos los archivos de despliegue y el `git push`.

> La primera vez, la GitHub Action fallará en el paso "desplegar" con el mensaje *"Faltan los secretos…"*. Es lo esperado: los secretos se ponen en el paso 5.

---

## Paso 3 — Crear las dos piezas en Render con el Blueprint

1. Entrad en **https://dashboard.render.com**.
2. Si es la primera vez, conectad Render con GitHub: **Account Settings → Git → Connect GitHub** (o Render os lo pedirá en el siguiente punto) y dadle acceso al repositorio **`DEL_PRUEBACIFO01`**.
3. Pulsad **New +** → **Blueprint**.
4. Elegid el repositorio **`davidorozcox-png/DEL_PRUEBACIFO01`** → **Connect**.
5. Render lee `render.yaml` y muestra las 2 piezas: **`del-pruebacifo01-api`** y **`del-pruebacifo01-web`**.
   - **Blueprint Name:** `tienda-tech`.
   - Os pedirá el valor de **`MONGODB_URI`**: pegad la dirección del paso 1.
6. Pulsad **Deploy Blueprint** (o **Apply**).
7. Esperad unos minutos. En el panel veréis las 2 piezas: primero *Building* y después **Live** (en verde).
   - El backend tarda más (descarga paquetes y compila). Si sale **Failed**, abrid el servicio → **Logs** y mirad el último mensaje rojo (ver "Problemas frecuentes").

---

## Paso 4 — Comprobar las direcciones

Render pone la dirección a partir del nombre. Si alguien ya usa ese nombre en Render, añade letras al final.

1. Abrid cada servicio en el panel de Render y mirad su dirección (arriba, debajo del nombre).
2. **Si coinciden** con `https://del-pruebacifo01-api.onrender.com` y `https://del-pruebacifo01-web.onrender.com` → no hay que tocar nada, id al paso 5.
3. **Si alguna es distinta**, decídselo a Claude, que cambiará:
   - la dirección del backend en `frontend/app.js`;
   - la variable `CORS_ORIGIN` en `render.yaml` (y en Render → servicio `del-pruebacifo01-api` → **Environment**).

---

## Paso 5 — Conectar GitHub Actions con Render (deploy hooks)

Un **deploy hook** es una dirección secreta de Render: quien la visite le dice "publica la última versión". Se la daremos a GitHub como **secreto**, para que la GitHub Action la use y nadie más la vea.

**5a. Copiar los deploy hooks de Render**
1. Render → servicio **`del-pruebacifo01-api`** → **Settings** → bajad hasta **Deploy Hook** → copiad la dirección (empieza por `https://api.render.com/deploy/srv-…`).
2. Lo mismo en el servicio **`del-pruebacifo01-web`**.

**5b. Guardarlos como secretos en GitHub**
1. Abrid **https://github.com/davidorozcox-png/DEL_PRUEBACIFO01/settings/secrets/actions**
   (o en el repositorio: **Settings → Secrets and variables → Actions**).
2. **New repository secret**:
   - Name: `RENDER_DEPLOY_HOOK_BACKEND`
   - Secret: el deploy hook del backend → **Add secret**.
3. **New repository secret** otra vez:
   - Name: `RENDER_DEPLOY_HOOK_FRONTEND`
   - Secret: el deploy hook de la web → **Add secret**.

Los nombres tienen que ser **exactamente** esos (mayúsculas incluidas).

---

## Paso 6 — Probar la GitHub Action

1. Abrid **https://github.com/davidorozcox-png/DEL_PRUEBACIFO01/actions**.
2. A la izquierda, **Desplegar en Render** → botón **Run workflow** → **Run workflow**.
3. Pulsad sobre la ejecución que aparece. Veréis los 2 trabajos:
   - **Comprobar que el backend compila** → ✅
   - **Desplegar en Render** → ✅ con el mensaje *"Render ha recibido el aviso…"*
4. En el panel de Render, las 2 piezas empiezan un despliegue nuevo y vuelven a **Live**.

A partir de ahora, **cada `git push` a `main` hace esto solo**.

---

## Paso 7 — Comprobar que todo funciona en internet

1. Abrid **`https://del-pruebacifo01-api.onrender.com/productos`** (la API).
   - Si tarda ~1 minuto: se está despertando. Es normal.
   - Deberíais ver el JSON con los **3 productos de ejemplo** (se cargan solos porque la base de Atlas está vacía).
2. Abrid **`https://del-pruebacifo01-web.onrender.com`** (la web).
   - Deberíais ver la tienda con los 3 productos.
3. Cread, editad y borrad productos. Recargad: siguen ahí (están en Atlas).
4. Prueba extra: abrid la web **desde el móvil**. Funciona porque ahora está en internet.
5. Prueba extra: en Atlas → **Clusters → Browse Collections** → base `tienda_tech` → colección `productos`: veréis los mismos documentos.

**Importante:** los datos de internet (Atlas) y los del Mac (`mongodb/datos/`) son **bases de datos distintas**. Lo que creéis en una no aparece en la otra.

---

## Problemas frecuentes

| Qué veis | Qué significa | Solución |
|---|---|---|
| `git push` rechazado: *"refusing to allow a Personal Access Token to create or update workflow … without `workflow` scope"* | El token no tiene permiso para subir GitHub Actions | Paso 2 |
| GitHub Action en rojo: *"Faltan los secretos…"* | No están los deploy hooks en GitHub | Paso 5 |
| Backend en Render **Failed**, en Logs: `MongooseServerSelectionError` o `bad auth` | No puede conectar con Atlas: contraseña mal copiada, falta el acceso `0.0.0.0/0`, o falta `tienda_tech` en la dirección | Revisad el paso 1 y corregid `MONGODB_URI` en Render → servicio → **Environment** → **Save, rebuild, and deploy** |
| La web carga pero sale *"No se puede conectar con la API…"* | El backend está dormido o falló, o la dirección en `app.js` no es la buena | Esperad 1 minuto y recargad; si sigue, mirad el paso 4 |
| En la consola del navegador: error de **CORS** | `CORS_ORIGIN` no coincide exactamente con la dirección de la web | Render → `del-pruebacifo01-api` → **Environment** → `CORS_ORIGIN` = dirección de la web **sin `/` al final** |
| La web tarda en mostrar los productos | El backend gratis estaba dormido | Normal en el plan gratuito |

---

## Seguridad (resumen)

- Secretos que **nunca** van en el repositorio: la `MONGODB_URI` (vive solo en Render) y los deploy hooks (viven solo en los secretos de GitHub). Si alguno se filtra: en Atlas se cambia la contraseña del usuario; en Render, **Regenerate Hook**.
- El token de GitHub del Mac sigue en el Llavero. Recordad borrarlo al acabar el curso.
- En el Mac, las 3 piezas siguen limitadas a este Mac. Solo en Render el backend acepta conexiones de internet.
