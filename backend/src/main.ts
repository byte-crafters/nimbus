import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RequestMethod, VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('/api', {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
    });
    app.enableVersioning({
        type: VersioningType.URI,
    });

    const config = new DocumentBuilder()
        .setTitle('Nimbus API')
        .setDescription('Nimbus API description')
        .setVersion('1.0')
        .addTag('health-check')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
