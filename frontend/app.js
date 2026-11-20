// FASE 1: los datos viven en esta lista, dentro de la memoria del navegador.
// Al recargar la página, la lista vuelve a empezar con estos productos de ejemplo.
let productos = [
  { _id: '1', nombre: 'MacBook Air', marca: 'Apple', categoria: 'portátil', precio: 1199, stock: 5, descripcion: '' },
  { _id: '2', nombre: 'Galaxy S24', marca: 'Samsung', categoria: 'móvil', precio: 899, stock: 10, descripcion: '' },
  { _id: '3', nombre: 'WH-1000XM5', marca: 'Sony', categoria: 'auriculares', precio: 349, stock: 0, descripcion: '' },
];

// Si estamos editando, aquí se guarda el _id del producto; si no, vale null
let idEditando = null;

const formulario = document.getElementById('formulario');
const listado = document.getElementById('listado');
const tituloFormulario = document.getElementById('titulo-formulario');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');

// VER: dibuja la tabla con todos los productos de la lista
function mostrarProductos() {
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
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault(); // evita que la página se recargue
  const datos = leerFormulario();

  if (idEditando === null) {
    // Crear: se genera un _id nuevo y se añade a la lista
    datos._id = String(Date.now());
    productos.push(datos);
  } else {
    // Editar: se sustituyen los datos del producto que tiene ese _id
    productos = productos.map((p) => (p._id === idEditando ? { ...datos, _id: idEditando } : p));
  }

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

// BORRAR: pide confirmación y quita el producto de la lista
function borrarProducto(id) {
  if (!confirm('¿Seguro que quieres borrar este producto?')) return;
  productos = productos.filter((p) => p._id !== id);
  if (idEditando === id) terminarEdicion();
  mostrarProductos();
}

// Al cargar la página, se dibuja el listado inicial
mostrarProductos();
