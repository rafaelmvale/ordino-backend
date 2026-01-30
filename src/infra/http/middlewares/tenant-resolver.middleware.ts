import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@shared/utils/jwt.service";
import { logger } from "@shared/logger";

// Extend Express Request to include tenantId
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      user?: {
        userId: string;
        email: string;
        companyId: string;
        role: string;
      };
    }
  }
}

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path || req.url || "";

    try {
      const token = this.extractTokenFromHeader(req);

      if (!token) {
        throw new UnauthorizedException("Token não fornecido");
      }

      const payload = JwtService.verify(token);

      if (!payload.companyId) {
        throw new UnauthorizedException(
          "Token inválido: companyId não encontrado"
        );
      }

      // Inject tenant context into request
      req.tenantId = payload.companyId;
      req.user = {
        userId: payload.userId,
        email: payload.email,
        companyId: payload.companyId,
        role: payload.role,
      };

      // Log tenant context
      logger.info(
        {
          tenantId: req.tenantId,
          userId: payload.userId,
          path: path,
          method: req.method,
        },
        "Tenant context resolved"
      );

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      logger.error(
        {
          error: error instanceof Error ? error.message : "Unknown error",
          path: path,
        },
        "Failed to resolve tenant context"
      );

      throw new UnauthorizedException("Token inválido ou expirado");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(" ");

    return type === "Bearer" ? token : undefined;
  }
}
