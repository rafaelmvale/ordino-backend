import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { config } from "./config";
import { setupSwagger } from "./infra/http/swagger";
import { ErrorLoggerInterceptor } from "./infra/http/interceptors/error-logger.interceptor";
import { logger } from "./shared/logger";
import { FastifyReply, FastifyRequest } from "fastify";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger,
      disableRequestLogging: true,
    })
  );

  app.setGlobalPrefix("api");

  const fastifyInstance = app.getHttpAdapter().getInstance();

  fastifyInstance.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      (request as any).startTime = Date.now();

      if (
        fastifyInstance.log &&
        typeof fastifyInstance.log.child === "function"
      ) {
        (request as any).log = fastifyInstance.log.child({
          requestId: request.id,
        });
      } else {
        (request as any).log = logger.child({ requestId: request.id });
      }

      reply.header("x-request-id", request.id);
    }
  );

  fastifyInstance.addHook(
    "onResponse",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const startTime = (request as any).startTime || Date.now();
      const duration = Date.now() - startTime;

      const contentLength = reply.getHeader("content-length");
      const logPayload: Record<string, unknown> = {
        msg: "HTTP Request",
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        duration,
        contentLength:
          typeof contentLength === "string" || typeof contentLength === "number"
            ? contentLength
            : null,
      };

      if ((request as any).user?.id) {
        logPayload.userId = (request as any).user.id;
      }

      const traceContext = request.headers["x-cloud-trace-context"];
      if (traceContext) {
        logPayload.trace = traceContext;
      }

      const reqLog = (request as any).log ?? logger;
      reqLog.info(logPayload);
    }
  );

  app.useGlobalInterceptors(new ErrorLoggerInterceptor());

  if (process.env.NODE_ENV !== "production") {
    await setupSwagger(app);
  }

  await app.listen(config.port, "0.0.0.0");

  logger.info(
    {
      port: config.port,
      env: process.env.NODE_ENV || "development",
    },
    "Application started"
  );

  logger.info({ url: `http://localhost:${config.port}/api` }, "API available");

  if (process.env.NODE_ENV !== "production") {
    logger.info(
      { url: `http://localhost:${config.port}/api/docs` },
      "Swagger UI available"
    );
  }
}
bootstrap();
