import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const logger = new Logger('Usuarios Microservices')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      }
    }
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  await app.listen();
  logger.log('NOTIFICACIONES services corriendo puerto ' + envs.port)
}
bootstrap();
