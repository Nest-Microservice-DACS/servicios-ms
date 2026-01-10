import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';
import {
  MicroserviceOptions,
  NestMicroservice,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('ServiciosMS-Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.PORT,
      },
    },
  );

  logger.log(`Servicios Microservice running on port ${envs.PORT}`);

  await app.listen();
}
bootstrap();
