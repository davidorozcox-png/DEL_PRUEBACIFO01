import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller.js';

// El módulo principal: le dice a NestJS qué controladores (rutas) tiene la API
@Module({
  controllers: [ProductosController],
})
export class AppModule {}
