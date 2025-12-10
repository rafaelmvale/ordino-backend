// src/infra/http/interceptors/error-logger.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { FastifyRequest } from "fastify";
import { logger } from "@shared/logger";

@Injectable()
export class ErrorLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    return next.handle().pipe(
      catchError((err) => {
        const statusCode =
          err instanceof HttpException
            ? err.getStatus()
            : err.status || HttpStatus.INTERNAL_SERVER_ERROR;

        const payload: Record<string, unknown> = {
          msg: "Unhandled Error",
          error: err?.message ?? String(err),
          statusCode,
          path: request?.url,
          method: request?.method,
        };

        // Só inclui stack em dev pra não vazar informação em prod
        if (process.env.NODE_ENV !== "production" && err?.stack) {
          payload.stack = err.stack;
        }

        // Usa child logger se existir (tem requestId no child)
        const reqLog = (request as any).log ?? logger;
        reqLog.error(payload);

        return throwError(() => err);
      })
    );
  }
}
