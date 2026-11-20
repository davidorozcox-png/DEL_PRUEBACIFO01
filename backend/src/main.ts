import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// Punto de arranque del backend
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite que la web servida en http://localhost:8080 pida datos a esta API
  app.enableCors({ origin: 'http://localhost:8080' });

  // El servidor se queda escuchando peticiones en el puerto 3000,
  // solo desde este Mac (127.0.0.1): otros ordenadores de la red no pueden entrar
  await app.listen(3000, '127.0.0.1');
  console.log('API lista en http://localhost:3000/productos');
}
await bootstrap();
