"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.enableCors();
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Discovery Service')
        .setDescription('Content discovery and search API for programs and episodes')
        .setVersion('1.0')
        .addTag('programs', 'Browse and view programs')
        .addTag('episodes', 'Browse and view episodes')
        .addTag('search', 'Full-text search across content')
        .addTag('categories', 'Browse content categories')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.APP_PORT || 3001;
    await app.listen(port);
    logger.log(`Discovery service running on port ${port}`);
    logger.log(`Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map