// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { Response, Request, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Static files
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
    setHeaders: (res: Response) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.set('Access-Control-Allow-Origin', '*');
    },
  });

  // Security - Helmet with relaxed settings for ngrok
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  );

  // ✅ COMPREHENSIVE CORS CONFIGURATION FOR NGROK
  const allowedOrigins = [
    // Local development
    'http://localhost:3000',
    'http://localhost:3001',

    // Production frontend (Vercel)
    'https://pusat-panduan-kpp-kb2.vercel.app',

    // Ngrok URLs (update ini jika ngrok URL berubah)
    'https://transcrystalline-kanesha-tragicomically.ngrok-free.dev',

    // Environment variable (flexible)
    process.env.FRONTEND_URL,
    process.env.NGROK_URL,
  ].filter(Boolean); // Remove undefined/null values

  app.enableCors({
    origin: (origin, callback) => {
      // ✅ Allow requests with no origin (curl, Postman, PowerShell, mobile apps)
      if (!origin) {
        console.log(
          '✅ Allowing request with no origin (likely from curl/Postman/PowerShell)',
        );
        return callback(null, true);
      }

      // ✅ Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ Allowing CORS for origin: ${origin}`);
        callback(null, true);
      } else {
        // ⚠️ Log but still allow for ngrok testing
        console.warn(
          `⚠️ Origin not in whitelist but allowing for testing: ${origin}`,
        );

        // For ngrok testing, allow all origins (comment out in production!)
        if (process.env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      // ✅ Ngrok specific headers
      'ngrok-skip-browser-warning',
      'Ngrok-Skip-Browser-Warning', // case variation
      'X-Forwarded-For',
      'X-Forwarded-Host',
      'X-Forwarded-Proto',
    ],
    exposedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Total-Count',
      'X-Page',
      'X-Per-Page',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours
  });

  // ✅ Add custom middleware to log all requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`📥 ${req.method} ${req.url}`);
    console.log(`   Origin: ${req.headers.origin || 'NO ORIGIN'}`);
    console.log(
      `   User-Agent: ${req.headers['user-agent']?.substring(0, 50) || 'N/A'}`,
    );

    // ✅ Manually add CORS headers for ngrok (backup solution)
    if (req.headers.origin || req.headers.host?.includes('ngrok')) {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      );
      res.header(
        'Access-Control-Allow-Headers',
        req.headers['access-control-request-headers'] || '*',
      );
    }

    // Handle preflight
    if (req.method === 'OPTIONS') {
      console.log('   ✅ Preflight request handled');
      return res.sendStatus(204);
    }

    next();
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

  // Swagger (development only)
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
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Start server
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); // ✅ Listen on all interfaces

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 KPP Help Center API Server Started`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Local:        http://localhost:${port}/api`);
  console.log(`📍 Network:      http://0.0.0.0:${port}/api`);
  console.log(`📚 Swagger:      http://localhost:${port}/api/docs`);
  console.log(`🖼️  Uploads:      http://localhost:${port}/uploads/`);
  console.log(`🌍 Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n✅ CORS Enabled for:`);
  allowedOrigins.forEach((origin) => {
    if (origin) console.log(`   - ${origin}`);
  });
  console.log(`${'='.repeat(60)}\n`);
}

bootstrap();
