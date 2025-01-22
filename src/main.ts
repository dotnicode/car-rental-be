import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'CarRentalApp',
    }),
  });

  app.enableCors();
  app.setGlobalPrefix('api');

  const port = envs.PORT ?? 4999;
  await app.listen(port, () => {
    logger.log(`Server is running on port ${port}`);
  });
}

bootstrap();
