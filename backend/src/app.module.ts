import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './productos.controller.js';
import { ProductoSchema } from './producto.schema.js';

// El módulo principal: le dice a NestJS qué controladores (rutas) tiene la API
// y cómo conectarse a la base de datos.
@Module({
  imports: [
    // Conexión con MongoDB: este Mac (127.0.0.1), puerto 27017, base de datos "tienda_tech"
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/tienda_tech'),
    // Registra el "modelo" Producto, que es lo que usa el controlador para leer y guardar
    MongooseModule.forFeature([{ name: 'Producto', schema: ProductoSchema }]),
  ],
  controllers: [ProductosController],
})
export class AppModule {}
