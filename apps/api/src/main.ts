import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global prefix untuk semua routes
  app.setGlobalPrefix('api');

  // ✅ FIX: Static files - serve uploads folder dengan path absolut
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
    // Tambahkan header untuk allow access
    setHeaders: (res) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.set('Access-Control-Allow-Origin', '*');
    },
  });

  // ✅ FIX: Security - Helmet dengan konfigurasi yang lebih permissive untuk development
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false, // Tambahkan ini
      contentSecurityPolicy: false, // Untuk development, disable dulu
    }),
  );

  // ✅ FIX: CORS - Allow frontend dengan kredensial lengkap
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000', // Explicit untuk development
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global Validation Pipe
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

  // Swagger API Documentation (hanya di development)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('KPP Help Center API')
      .setDescription(
        'API untuk Pusat Bantuan KPP Pratama Jakarta Kebayoran Baru Dua',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Masukkan JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('categories', 'Category management endpoints')
      .addTag('articles', 'Article management endpoints')
      .addTag('public', 'Public endpoints (tanpa auth)')
      .addTag('upload', 'File upload endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Start server
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 API Server running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
  console.log(`📁 Uploads folder: http://localhost:${port}/uploads/`);
}

bootstrap();
