import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// Punto de arranque del backend.
// Funciona igual en el Mac y en Render: lo que cambia son las "variables de entorno",
// valores que Render le pasa al programa al arrancarlo.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: qué web puede pedir datos a esta API.
  // En Render: la dirección de la web en Render (variable CORS_ORIGIN). En el Mac: http://localhost:8080
  app.enableCors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:8080' });

  // Puerto: en Render lo decide Render (variable PORT). En el Mac: 3000
  const puerto = Number(process.env.PORT ?? 3000);

  // En Render (variable RENDER) hay que aceptar conexiones de internet (0.0.0.0).
  // En el Mac, solo desde este Mac (127.0.0.1): otros ordenadores de la red no pueden entrar
  const direccion = process.env.RENDER ? '0.0.0.0' : '127.0.0.1';

  await app.listen(puerto, direccion);
  console.log(`API lista en http://localhost:${puerto}/productos`);
}
await bootstrap();
