import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export async function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Ordino API")
    .setDescription(
      "API para Ordino (MVP) — agendamentos, empresas e auth magic link"
    )
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      docExpansion: "list",
      deepLinking: false,
    },
  });
}
