import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { config } from "./config";
import { setupSwagger } from "./infra/http/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  app.setGlobalPrefix("api");

  if (process.env.NODE_ENV !== "production") {
    await setupSwagger(app);
  }

  await app.listen(config.port, "0.0.0.0");
  console.log(`Application is running on: http://localhost:${config.port}/api`);
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `Swagger UI available at: http://localhost:${config.port}/api/docs`
    );
  }
}
bootstrap();
