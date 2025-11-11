import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Motel management API')
    .setDescription('API for managing resources related to the motel management system')
    .setVersion('1.0')
    .addTag('motel-management')
    .addServer('/api/v1')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            description: 'Enter access token',
            in: 'header'
        },
    )
    .build(); 