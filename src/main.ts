import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExpectionFilter } from './common/filters/http-exception.filter';
import { DatabaseInterceptor } from './common/errors/interceptors/database.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Blog API')
        .setDescription('An API for a blog')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalFilters(new HttpExpectionFilter());
    app.useGlobalInterceptors(new DatabaseInterceptor());

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
