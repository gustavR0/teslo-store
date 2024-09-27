import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // solo deja la data que existe en el dto data adicional es ignorada
      forbidNonWhitelisted: true, // manda error de los atributos que no son aceptados en caso de que no existan en el dto
      /*  transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }, */
    }),
  );
  await app.listen(process.env.PORT);
  logger.log(`App Running on port ${process.env.PORT}`, 'AppStarted');
}
bootstrap();
