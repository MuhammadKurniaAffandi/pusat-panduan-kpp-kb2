import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Static files (only in development)
  if (process.env.NODE_ENV !== 'production') {
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
      setHeaders: (res: Response) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        res.set('Access-Control-Allow-Origin', '*');
      },
    });
  }

  // Security - Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
    }),
  );

  // CORS - Dynamic origins
  // const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [
  //   'http://localhost:3000',
  // ];
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((url) => url.trim());

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // exposedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger (disable di production)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('KPP Help Center API')
      .setDescription('API untuk Pusat Bantuan KPP KB2')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Vercel Serverless Export
  await app.init();
  // Start server
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); // Bind to 0.0.0.0 for Railway/Docker

  // console.log(` API Server running on: http://localhost:${port}/api`);
  // console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  // console.log(` Allowed Origins: ${allowedOrigins.join(', ')}`);

  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(` Swagger Docs: http://localhost:${port}/api/docs`);
    console.log(` Uploads: http://localhost:${port}/uploads/`);
  }
  return app;
}

bootstrap();
