// FASE 2: los datos ya NO viven aquí. Viven en el backend (la API en el puerto 3000).
// Este archivo pide y envía los datos a la API con fetch (peticiones HTTP con JSON).
// En el Mac (localhost) se usa la API local; publicada en Render, la API de Render.
// Si Render os da otra dirección para el backend, cambiadla aquí (ver DESPLIEGUE.md).
const EN_MI_MAC = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const API = (EN_MI_MAC ? 'http://localhost:3000' : 'https://del-pruebacifo01-api.onrender.com') + '/productos';

// Copia de lo último que nos mandó la API (solo para rellenar el formulario al editar)
let productos = [];

// Si estamos editando, aquí se guarda el _id del producto; si no, vale null
let idEditando = null;

const formulario = document.getElementById('formulario');
const listado = document.getElementById('listado');
const tituloFormulario = document.getElementById('titulo-formulario');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');

// Envía una petición a la API y devuelve la respuesta en JSON.
// Si la API responde con error, muestra el mensaje al usuario.
async function pedirAPI(url, metodo = 'GET', datos) {
  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: datos ? JSON.stringify(datos) : undefined,
    });
    const json = await respuesta.json();
    if (!respuesta.ok) {
      const mensaje = Array.isArray(json.message) ? json.message.join('\n') : json.message;
      alert('Error de la API:\n' + mensaje);
      return null;
    }
    return json;
  } catch (error) {
    alert('No se puede conectar con la API. ¿Está arrancado el backend en el puerto 3000?');
    return null;
  }
}

// VER: pide la lista a la API (GET /productos) y dibuja la tabla
async function mostrarProductos() {
  const respuesta = await pedirAPI(API);
  if (respuesta === null) return;
  productos = respuesta;

  listado.innerHTML = '';
  for (const producto of productos) {
    const fila = document.createElement('tr');
    const textos = [
      producto.nombre,
      producto.marca,
      producto.categoria,
      producto.precio + ' €',
      producto.stock,
      producto.descripcion,
    ];
    for (const texto of textos) {
      const celda = document.createElement('td');
      celda.textContent = texto;
      fila.appendChild(celda);
    }

    const celdaAcciones = document.createElement('td');
    const botonEditar = document.createElement('button');
    botonEditar.textContent = 'Editar';
    botonEditar.className = 'secundario';
    botonEditar.onclick = () => empezarEdicion(producto._id);
    const botonBorrar = document.createElement('button');
    botonBorrar.textContent = 'Borrar';
    botonBorrar.className = 'peligro';
    botonBorrar.onclick = () => borrarProducto(producto._id);
    celdaAcciones.append(botonEditar, botonBorrar);
    fila.appendChild(celdaAcciones);

    listado.appendChild(fila);
  }
}

// Lee los campos del formulario y los devuelve como un producto
function leerFormulario() {
  return {
    nombre: document.getElementById('nombre').value.trim(),
    marca: document.getElementById('marca').value.trim(),
    categoria: document.getElementById('categoria').value,
    precio: Number(document.getElementById('precio').value),
    stock: Number(document.getElementById('stock').value || 0), // vacío = 0
    descripcion: document.getElementById('descripcion').value.trim(),
  };
}

// CREAR o EDITAR: se ejecuta al pulsar el botón del formulario
formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault(); // evita que la página se recargue
  const datos = leerFormulario();

  let resultado;
  if (idEditando === null) {
    // Crear: POST /productos (el backend genera el _id)
    resultado = await pedirAPI(API, 'POST', datos);
  } else {
    // Editar: PATCH /productos/:id
    resultado = await pedirAPI(API + '/' + idEditando, 'PATCH', datos);
  }

  if (resultado === null) return; // hubo un error: se deja el formulario como está
  terminarEdicion();
  mostrarProductos();
});

// EDITAR (inicio): rellena el formulario con los datos del producto elegido
function empezarEdicion(id) {
  const producto = productos.find((p) => p._id === id);
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('marca').value = producto.marca;
  document.getElementById('categoria').value = producto.categoria;
  document.getElementById('precio').value = producto.precio;
  document.getElementById('stock').value = producto.stock;
  document.getElementById('descripcion').value = producto.descripcion;

  idEditando = id;
  tituloFormulario.textContent = 'Editar producto';
  botonGuardar.textContent = 'Guardar cambios';
  botonCancelar.hidden = false;
}

// Vacía el formulario y vuelve al modo "crear"
function terminarEdicion() {
  formulario.reset();
  idEditando = null;
  tituloFormulario.textContent = 'Nuevo producto';
  botonGuardar.textContent = 'Crear producto';
  botonCancelar.hidden = true;
}

botonCancelar.addEventListener('click', terminarEdicion);

// BORRAR: pide confirmación y envía DELETE /productos/:id
async function borrarProducto(id) {
  if (!confirm('¿Seguro que quieres borrar este producto?')) return;
  const resultado = await pedirAPI(API + '/' + id, 'DELETE');
  if (resultado === null) return;
  if (idEditando === id) terminarEdicion();
  mostrarProductos();
}

// Al cargar la página, se pide el listado a la API
mostrarProductos();
