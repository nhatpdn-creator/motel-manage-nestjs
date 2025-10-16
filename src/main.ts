import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { swaggerConfig } from '@/config/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.setGlobalPrefix('api/v1', { exclude: [''] });
  
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      const messages = errors
        .map(err => Object.values(err.constraints))
        .flat();
      return new BadRequestException({ message: messages});
    },
  }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
