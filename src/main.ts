import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.CORS_ORIGINS;
  if (corsOrigins) {
    app.enableCors({
      origin: corsOrigins.split(',').map((origin) => origin.trim()),
      credentials: true,
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Monitoring BATO')
      .setDescription('API de moniroting du système BATO')
      .setVersion('1.0')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, documentFactory);
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.TCP_PORT) || 6005,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4005);
}

bootstrap();
