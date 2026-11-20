import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  OnModuleInit,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error as ErrorMongoose, isValidObjectId, Model } from 'mongoose';

// FASE 3: los datos ya NO viven en una lista del servidor.
// Se guardan en MongoDB (base "tienda_tech", colección "productos") y sobreviven a los reinicios.

// Productos de ejemplo: solo se guardan si la colección está vacía
const EJEMPLOS = [
  { nombre: 'MacBook Air', marca: 'Apple', categoria: 'portátil', precio: 1199, stock: 5 },
  { nombre: 'Galaxy S24', marca: 'Samsung', categoria: 'móvil', precio: 899, stock: 10 },
  { nombre: 'WH-1000XM5', marca: 'Sony', categoria: 'auriculares', precio: 349, stock: 0 },
];

// Si MongoDB rechaza los datos por no cumplir las reglas del esquema, responde con error 400
function errorDeDatos(error: unknown): never {
  if (error instanceof ErrorMongoose.ValidationError) {
    throw new BadRequestException(Object.values(error.errors).map((e) => e.message));
  }
  throw error;
}

// Todas las rutas de este archivo empiezan por /productos
@Controller('productos')
export class ProductosController implements OnModuleInit {
  // "modelo" = la herramienta de Mongoose para leer y guardar productos en MongoDB
  constructor(@InjectModel('Producto') private modelo: Model<any>) {}

  // Al arrancar el backend: si no hay productos, guarda los de ejemplo
  async onModuleInit() {
    if ((await this.modelo.countDocuments()) === 0) {
      await this.modelo.insertMany(EJEMPLOS);
    }
  }

  // Busca un producto por su _id; si no existe, responde con error 404
  private async buscar(id: string) {
    const producto = isValidObjectId(id) ? await this.modelo.findById(id) : null;
    if (!producto) throw new NotFoundException('No existe un producto con _id ' + id);
    return producto;
  }

  // GET /productos → listar todos
  @Get()
  listar() {
    return this.modelo.find();
  }

  // GET /productos/:id → ver uno
  @Get(':id')
  ver(@Param('id') id: string) {
    return this.buscar(id);
  }

  // POST /productos → crear (MongoDB genera el _id)
  @Post()
  async crear(@Body() datos: any) {
    const { _id, ...campos } = datos ?? {};
    return this.modelo.create(campos).catch(errorDeDatos);
  }

  // PATCH /productos/:id → editar (solo cambia los campos que llegan)
  @Patch(':id')
  async editar(@Param('id') id: string, @Body() datos: any) {
    const producto = await this.buscar(id);
    const { _id, ...cambios } = datos ?? {}; // el _id no se puede cambiar
    producto.set(cambios);
    return producto.save().catch(errorDeDatos);
  }

  // DELETE /productos/:id → borrar
  @Delete(':id')
  async borrar(@Param('id') id: string) {
    const producto = await this.buscar(id);
    await producto.deleteOne();
    return producto;
  }
}
