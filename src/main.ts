import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Aplicar pipes de validação globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Configurar o Swagger para documentação da API
  const config = new DocumentBuilder()
    .setTitle('LifeCare API')
    .setDescription('API para o aplicativo LifeCare de cuidadores e idosos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Habilitar CORS
  app.enableCors();
  
  // Usar porta fixa 3006
  const port = 3006;
  
  await app.listen(port);
  console.log(`Aplicação rodando na porta fixa: ${port}`);
  console.log(`Swagger disponível em: http://localhost:${port}/api`);
}

bootstrap();
