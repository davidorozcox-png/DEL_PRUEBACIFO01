import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

// Forma de un producto (igual que en el frontend)
interface Producto {
  _id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
}

const CATEGORIAS = ['portátil', 'móvil', 'tablet', 'monitor', 'auriculares', 'accesorio'];

// FASE 2: los datos viven en esta lista, dentro de la memoria del servidor.
// Al reiniciar el backend, la lista vuelve a empezar con estos productos de ejemplo.
let productos: Producto[] = [
  { _id: '1', nombre: 'MacBook Air', marca: 'Apple', categoria: 'portátil', precio: 1199, stock: 5, descripcion: '' },
  { _id: '2', nombre: 'Galaxy S24', marca: 'Samsung', categoria: 'móvil', precio: 899, stock: 10, descripcion: '' },
  { _id: '3', nombre: 'WH-1000XM5', marca: 'Sony', categoria: 'auriculares', precio: 349, stock: 0, descripcion: '' },
];

// REGLAS: comprueba los datos recibidos. Si algo falla, responde con error 400.
// "parcial" = true al editar: solo se comprueban los campos que llegan.
function validar(datos: Partial<Producto>, parcial: boolean) {
  const errores: string[] = [];
  const falta = (campo: keyof Producto) => !parcial && datos[campo] === undefined;

  if (falta('nombre') || (datos.nombre !== undefined && String(datos.nombre).trim() === ''))
    errores.push('nombre es obligatorio');
  if (falta('marca') || (datos.marca !== undefined && String(datos.marca).trim() === ''))
    errores.push('marca es obligatoria');
  if (falta('categoria') || (datos.categoria !== undefined && !CATEGORIAS.includes(datos.categoria)))
    errores.push('categoria debe ser una de: ' + CATEGORIAS.join(', '));
  if (falta('precio') || (datos.precio !== undefined && !(typeof datos.precio === 'number' && datos.precio >= 0)))
    errores.push('precio es obligatorio y debe ser un número mayor o igual que 0');
  if (datos.stock !== undefined && !(Number.isInteger(datos.stock) && datos.stock >= 0))
    errores.push('stock debe ser un número entero mayor o igual que 0');

  if (errores.length > 0) throw new BadRequestException(errores);
}

// Busca un producto por su _id; si no existe, responde con error 404
function buscar(id: string): Producto {
  const producto = productos.find((p) => p._id === id);
  if (!producto) throw new NotFoundException('No existe un producto con _id ' + id);
  return producto;
}

// Todas las rutas de este archivo empiezan por /productos
@Controller('productos')
export class ProductosController {
  // GET /productos → listar todos
  @Get()
  listar() {
    return productos;
  }

  // GET /productos/:id → ver uno
  @Get(':id')
  ver(@Param('id') id: string) {
    return buscar(id);
  }

  // POST /productos → crear
  @Post()
  crear(@Body() datos: Partial<Producto>) {
    validar(datos, false);
    const nuevo: Producto = {
      _id: String(Date.now()), // en la fase 3 lo generará MongoDB
      nombre: String(datos.nombre).trim(),
      marca: String(datos.marca).trim(),
      categoria: datos.categoria!,
      precio: datos.precio!,
      stock: datos.stock ?? 0, // si no llega, vale 0
      descripcion: (datos.descripcion ?? '').trim(),
    };
    productos.push(nuevo);
    return nuevo;
  }

  // PATCH /productos/:id → editar (solo cambia los campos que llegan)
  @Patch(':id')
  editar(@Param('id') id: string, @Body() datos: Partial<Producto>) {
    const producto = buscar(id);
    validar(datos, true);
    const { _id, ...cambios } = datos; // el _id no se puede cambiar
    Object.assign(producto, cambios);
    return producto;
  }

  // DELETE /productos/:id → borrar
  @Delete(':id')
  borrar(@Param('id') id: string) {
    const producto = buscar(id);
    productos = productos.filter((p) => p._id !== id);
    return producto;
  }
}
