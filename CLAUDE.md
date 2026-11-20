# CLAUDE.md — Proyecto fullstack de aprendizaje: Tienda Tech

## 1. Contexto y objetivo

Este es un proyecto **de aprendizaje**. El objetivo es que el equipo **entienda las piezas** de una aplicación fullstack (frontend, backend y base de datos), qué papel cumple cada una y cómo se comunican entre sí.

El objetivo **no** es aprender a programar. El equipo no va a leer el código, así que:

- El código debe ser **lo más sencillo posible**: pocos archivos, sin abstracciones ni patrones innecesarios, sin librerías que no sean imprescindibles.
- Comentarios breves y en castellano solo donde ayuden a entender qué hace cada parte.
- Las explicaciones se centran en **qué hace cada pieza y por qué**, no en la sintaxis.

La aplicación es una web con un **formulario** y un **listado de productos tecnológicos**, con las operaciones de crear, ver, editar y borrar (CRUD completo).

## 2. Perfil del equipo

- Nivel **bajo** en terminal y Node.
- Sistema operativo: **macOS**.
- **Node.js ya está instalado.**
- Idioma de trabajo: **castellano** (explicaciones, comentarios y nombres en el código).

Consecuencias para tu forma de trabajar:

- Antes de ejecutar cualquier comando, explica en una frase qué hace y por qué es necesario.
- Usa lenguaje sencillo. Cuando aparezca un término técnico nuevo, explícalo en una línea y añádelo al glosario (sección 10).
- Si pides que el equipo haga algo (abrir una URL, escribir en la terminal), da instrucciones exactas y di qué deberían ver.

## 3. Stack y alcance

| Pieza | Tecnología | Detalle |
|---|---|---|
| Frontend | HTML, CSS y JavaScript sin frameworks | 3 archivos (`index.html`, `styles.css`, `app.js`), servidos con `npx http-server -a 127.0.0.1 -p 8080` (puerto **8080**, solo desde este Mac) |
| Backend | NestJS | API REST en el puerto **3000**, solo desde este Mac (`127.0.0.1`) |
| Base de datos | MongoDB instalado en local en el Mac | Base `tienda_tech`, colección `productos`, conexión desde NestJS con Mongoose |

Todo se ejecuta **en local**.

**Fuera de alcance** (no proponer ni introducir salvo que el equipo lo pida):

- Autenticación y usuarios.
- Despliegue o servicios en la nube.
- Docker.
- Frameworks de frontend (React, Vue, etc.).
- Tests automáticos.
- **Git** (añadido a petición del equipo el 2026-11-20): se usa solo para guardar un commit al cerrar cada fase (título: `fase N`). Configuración de autor solo local, dentro del proyecto. Repositorio remoto en GitHub (añadido a petición del equipo el 2026-11-20): `https://github.com/davidorozcox-png/DEL_PRUEBACIFO01.git` (público, rama `main`). El token de acceso se guarda en el Llavero de macOS, nunca en archivos del proyecto. Al crear el proyecto NestJS, usa la opción `--skip-git` para que no cree un segundo repositorio dentro de `backend/`.

## 4. Modelo de producto

| Campo | Tipo | Regla |
|---|---|---|
| `_id` | texto | identificador único, lo genera el sistema |
| `nombre` | texto | obligatorio |
| `marca` | texto | obligatorio |
| `categoria` | lista cerrada | `portátil`, `móvil`, `tablet`, `monitor`, `auriculares`, `accesorio` |
| `precio` | número | obligatorio, mayor o igual que 0 |
| `stock` | número entero | mayor o igual que 0, por defecto 0 |
| `descripcion` | texto | opcional |

El identificador se llama `_id` en **todas las fases** (es el nombre que usará MongoDB), para que el frontend no tenga que cambiar al añadir la base de datos.

## 5. API (a partir de la fase 2)

| Método y ruta | Qué hace |
|---|---|
| `GET /productos` | Listar todos los productos |
| `GET /productos/:id` | Ver un producto |
| `POST /productos` | Crear un producto |
| `PATCH /productos/:id` | Editar un producto |
| `DELETE /productos/:id` | Borrar un producto |

Este contrato (rutas, campos y formato JSON) **no cambia** entre la fase 2 y la fase 3: solo cambia dónde se guardan los datos.

## 6. Estructura de carpetas

```
proyecto/
├── CLAUDE.md
├── BITACORA.md     (diario del proyecto: qué hacemos y qué decidimos cada día)
├── REPASO.md       (fase 4: recorrido de una petición pieza por pieza)
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── backend/        (proyecto NestJS, se crea en la fase 2)
```

## 7. Reglas de trabajo (obligatorias)

1. **Antes de cada paso**, explica:
   - qué vas a hacer y por qué;
   - qué pieza se toca (frontend, backend o base de datos);
   - qué archivos se crean o modifican y qué comandos se ejecutarán.

   Después, **espera la aprobación explícita del equipo**. No avances sin ella.
2. **Un paso cada vez.** No te adelantes a la fase siguiente ni añadas nada que no esté en la fase actual.
3. **No instales, borres ni modifiques nada fuera de la carpeta del proyecto** sin permiso explícito. Esto incluye instalaciones globales, Homebrew y servicios del sistema.
4. **Pregunta siempre que tengas dudas.** No supongas nada. Tómate el tiempo necesario: es preferible preguntar de más que avanzar con una suposición.
5. **Al terminar cada paso:**
   - resume en pocas líneas qué ha cambiado;
   - indica cómo comprobar juntos que funciona (qué abrir, qué hacer y qué se debería ver);
   - relaciona lo hecho con el recorrido completo de los datos (navegador → backend → base de datos, según la fase).
6. **Ante un error:** explica primero qué significa en lenguaje sencillo, luego propón la corrección y espera aprobación.
7. Si una decisión no está cubierta por este documento, presenta las opciones con sus ventajas e inconvenientes y deja que el equipo decida.
8. No modifiques este `CLAUDE.md` sin pedir permiso.
9. **Bitácora:** al empezar cada sesión, lee `BITACORA.md` para recuperar el contexto. Al terminar cada paso, actualízalo con lo hecho, las decisiones (con su porqué), los errores y el estado actual.

## 8. Fases del proyecto

El orden de las fases lo fija el profesor y debe respetarse. Cada fase añade una pieza y muestra **dónde viven los datos**.

### Fase 0 — Entorno
- **Objetivo:** comprobar que Node.js y npm funcionan. Solo comprobar, sin instalar nada.
- **Comprobación:** ambos comandos responden con su versión.

### Fase 1 — Frontend simple
- **Objetivo:** crear la web con el formulario y el listado, con CRUD completo.
- **Datos:** se guardan en una lista dentro de `app.js`, en la memoria del navegador. Empieza con 2 o 3 productos de ejemplo.
- **Servir la web:** `npx http-server` en el puerto 8080.
- **Comprobación:** crear, editar y borrar productos en la web. Al recargar la página, los cambios se pierden.
- **Idea que se aprende:** el frontend es lo que ve y usa la persona; por sí solo no guarda nada de forma duradera.

### Fase 2 — Backend
- **2a. Crear la API** con NestJS (sin instalaciones globales, usando `npx`).
  - **Datos:** se guardan en una lista en la memoria del servidor.
  - **Comprobación:** probar los 5 endpoints desde el navegador o la terminal.
- **2b. Conectar frontend y backend:** el frontend deja de usar su lista interna y pide los datos a la API con `fetch`. Explica qué es CORS y actívalo para `http://localhost:8080`.
  - **Comprobación:** al recargar la página, los datos se mantienen. Al reiniciar el backend, se pierden.
- **Idea que se aprende:** el backend recibe peticiones, aplica las reglas y responde con datos; frontend y backend son programas distintos que se comunican por HTTP.

### Fase 3 — Base de datos (MongoDB)
- **3a. Instalar y arrancar MongoDB** en el Mac. Comprueba primero si Homebrew está instalado y explica cada paso antes de proponerlo (puede pedir la contraseña del Mac).
- **3b. Conectar el backend a MongoDB** con Mongoose. El backend deja de usar su lista en memoria. El frontend no cambia.
- **Comprobación:** reiniciar el backend y comprobar que los productos siguen ahí.
- **Idea que se aprende:** la base de datos guarda la información de forma permanente; el backend es el único que habla con ella.

### Fase 4 — Repaso
- Recorrer juntos una petición de principio a fin (por ejemplo, crear un producto), pieza por pieza.
- El equipo explica con sus palabras qué hace cada pieza.

## 9. Recorrido de una petición (versión final)

```
Navegador (frontend, :8080)
   │  fetch → petición HTTP con JSON
   ▼
Backend NestJS (:3000)
   │  Mongoose → consulta
   ▼
MongoDB (base tienda_tech, colección productos)
   │  resultado
   ▼
Backend → respuesta JSON → Navegador actualiza el listado
```

## 10. Glosario

Amplíalo a medida que aparezcan términos nuevos (una línea por término).

- **Frontend:** la parte que se ve y se usa en el navegador.
- **Backend:** el programa que recibe peticiones, aplica las reglas y gestiona los datos.
- **Base de datos:** donde se guardan los datos de forma permanente.
- **API:** el conjunto de "puertas" (rutas) por las que el frontend pide cosas al backend.
- **Endpoint:** cada una de esas puertas (por ejemplo, `GET /productos`).
- **Puerto:** el número que identifica a qué programa del ordenador va una petición (8080, 3000…).
- **JSON:** el formato de texto con el que se intercambian los datos.
- **CORS:** la regla del navegador que decide si una web puede pedir datos a un servidor distinto.
- **Colección / documento:** en MongoDB, una colección agrupa documentos; cada documento es un producto.
- **Node.js:** el programa que permite ejecutar JavaScript fuera del navegador; con él funcionará el backend.
- **npm:** la herramienta que viene con Node.js para descargar paquetes (piezas de código hechas por otros).
- **npx:** una herramienta de npm que ejecuta un paquete sin instalarlo de forma permanente.
- **Servidor:** un programa que se queda esperando peticiones y las responde (por ejemplo, entregando archivos o datos).
- **localhost:** el nombre con el que el ordenador se refiere a sí mismo; `localhost:8080` es "este Mac, puerto 8080".
- **Git:** programa que guarda el historial de cambios de un proyecto, para poder ver qué cambió y volver atrás.
- **Repositorio:** una carpeta cuyo historial de cambios guarda Git.
- **Commit:** una "foto" del proyecto en un momento dado, con un título que explica qué contiene.
- **.gitignore:** archivo con la lista de cosas que Git debe ignorar y no guardar.
- **Command Line Tools:** paquete de herramientas de Apple para la terminal; incluye Git.
- **GitHub:** web donde se guarda una copia del repositorio en internet.
- **Remoto (origin):** la copia del repositorio que está en GitHub; `origin` es su nombre.
- **Push:** subir los commits del Mac a GitHub.
- **Token:** contraseña especial creada en GitHub para que la terminal pueda subir cambios.
- **Llavero (Keychain):** el almacén de contraseñas de macOS.
- **TypeScript:** JavaScript con tipos (se indica qué forma tienen los datos); es el lenguaje que usa NestJS.
- **Controlador:** en NestJS, el archivo que define las rutas (endpoints) y qué hacer en cada una.
- **Módulo:** en NestJS, la pieza que agrupa y registra los controladores de la API.
- **fetch:** la función del navegador para hacer peticiones HTTP desde JavaScript.
- **HTTP:** el "idioma" con el que navegador y servidor se piden y envían cosas (métodos GET, POST, PATCH, DELETE).
- **Código de estado:** número que acompaña a cada respuesta HTTP: 200/201 = bien, 400 = datos incorrectos, 404 = no existe.
- **curl:** comando de la terminal para hacer peticiones HTTP sin navegador.
- **Preflight:** petición previa (OPTIONS) que el navegador manda para preguntar si tiene permiso CORS antes de un PATCH o DELETE.
- **node_modules:** carpeta con los paquetes descargados por npm; pesa mucho y no se guarda en Git.
- **Homebrew:** programa para instalar herramientas en el Mac desde la terminal; necesita un usuario administrador.
- **Administrador:** usuario del Mac con permiso para instalar cosas en el sistema.
- **mongod:** el programa servidor de MongoDB; se queda escuchando en el puerto 27017.
- **Huella SHA-256:** código que identifica un archivo; si coincide con el oficial, el archivo no se ha dañado ni manipulado.
- **Mongoose:** librería que usa el backend para hablar con MongoDB (guardar, buscar, editar, borrar).
- **Esquema:** descripción de la forma de un documento (campos, tipos y reglas) que Mongoose comprueba antes de guardar.
- **Modelo:** la herramienta de Mongoose, creada a partir del esquema, con la que el backend lee y escribe en una colección.
- **Vulnerabilidad (npm audit):** fallo de seguridad conocido en algún paquete; importa sobre todo en lo que se publica en internet.
