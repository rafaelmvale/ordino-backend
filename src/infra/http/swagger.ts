import { INestApplication } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "yamljs";

export async function setupSwagger(app: INestApplication) {
  const yamlPath = path.join(process.cwd(), "src", "docs", "openapi.yaml");

  const fastifyInstance = app.getHttpAdapter().getInstance();

  if (fs.existsSync(yamlPath)) {
    const yamlContent = fs.readFileSync(yamlPath, "utf8");
    const spec = yaml.parse(yamlContent);

    await fastifyInstance.register(require("@fastify/swagger"), {
      mode: "dynamic",
      openapi: spec,
    });

    await fastifyInstance.register(require("@fastify/swagger-ui"), {
      routePrefix: "/api/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: false,
      },
    });
    return;
  }

  await fastifyInstance.register(require("@fastify/swagger"), {
    routePrefix: "/api/docs",
    swagger: {
      info: { title: "Ordino API (fallback)", version: "0.1.0" },
    },
  });
  await fastifyInstance.register(require("@fastify/swagger-ui"), {
    routePrefix: "/api/docs",
  });
}
