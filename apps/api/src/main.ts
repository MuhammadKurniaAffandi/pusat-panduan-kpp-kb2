import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import express, { Request, Response } from 'express';

// ✅ Export untuk Vercel Serverless
export default async (req: Request, res: Response) => {
  /* Menampilkan pesan error berwarna merah "Unsafe assignment of an error typed value.eslint@typescript-eslint/no-unsafe-assignment
This expression is not callable.
  Type 'typeof e' has no call signatures.ts(2349)
main.ts(6, 1): Type originates at this import. A namespace-style import cannot be called or constructed, and will cause a failure at runtime. Consider using a default import or import require here instead.
(alias) function express(): Express
(alias) namespace express
import express
Creates an Express application. The express() function is a top-level function exported by the express module." */
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Security
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // CORS
  const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.init();

  /* Menampilkan pesan error berwarna merah "Unsafe call of a(n) `error` type typed value.eslint@typescript-eslint/no-unsafe-call
const server: any" */
  server(req, res);
};

// ✅ Untuk local development
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });

    await app.listen(3001);
    console.log('🚀 Dev server running on http://localhost:3001/api');
  }
  bootstrap();
}
