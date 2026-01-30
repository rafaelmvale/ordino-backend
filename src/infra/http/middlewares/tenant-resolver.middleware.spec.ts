import { UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { TenantResolverMiddleware } from "./tenant-resolver.middleware";
import { JwtService } from "@shared/utils/jwt.service";

jest.mock("@shared/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("TenantResolverMiddleware", () => {
  let middleware: TenantResolverMiddleware;
  let mockRequest: any;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    middleware = new TenantResolverMiddleware();
    mockRequest = {
      headers: {},
      path: "/companies",
      method: "GET",
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  // Note: Public route exclusion is handled by NestJS .forRoutes(CompaniesController) in app.module.ts
  // The middleware itself no longer handles route exclusion logic
  // It is only applied to CompaniesController routes

  describe("Protected routes", () => {
    it("should throw UnauthorizedException when no token is provided", () => {
      mockRequest.path = "/companies";

      expect(() => {
        middleware.use(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }).toThrow(UnauthorizedException);
      expect(() => {
        middleware.use(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }).toThrow("Token não fornecido");
    });

    it("should throw UnauthorizedException when token is invalid", () => {
      mockRequest.headers = {
        authorization: "Bearer invalid-token",
      };

      jest.spyOn(JwtService, "verify").mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => {
        middleware.use(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }).toThrow(UnauthorizedException);
      expect(() => {
        middleware.use(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }).toThrow("Token inválido ou expirado");
    });

    it("should throw UnauthorizedException when companyId is missing from token", () => {
      mockRequest.headers = {
        authorization: "Bearer valid-token",
      };

      jest.spyOn(JwtService, "verify").mockReturnValue({
        userId: "user-123",
        email: "user@example.com",
        companyId: "", // Empty companyId
        role: "OWNER",
      });

      expect(() => {
        middleware.use(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }).toThrow(UnauthorizedException);
      expect(() => {
        middleware.use(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }).toThrow("Token inválido: companyId não encontrado");
    });

    it("should inject tenantId when valid token is provided", () => {
      mockRequest.headers = {
        authorization: "Bearer valid-token",
      };

      const mockPayload = {
        userId: "user-123",
        email: "user@example.com",
        companyId: "company-456",
        role: "OWNER",
      };

      jest.spyOn(JwtService, "verify").mockReturnValue(mockPayload);

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.tenantId).toBe("company-456");
      expect(mockRequest.user).toEqual(mockPayload);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should extract Bearer token correctly", () => {
      mockRequest.headers = {
        authorization: "Bearer my-jwt-token",
      };

      const mockPayload = {
        userId: "user-123",
        email: "user@example.com",
        companyId: "company-456",
        role: "ADMIN",
      };

      jest.spyOn(JwtService, "verify").mockReturnValue(mockPayload);

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(JwtService.verify).toHaveBeenCalledWith("my-jwt-token");
      expect(mockRequest.tenantId).toBe("company-456");
    });

    it("should not extract token with invalid auth type", () => {
      mockRequest.headers = {
        authorization: "Basic base64-encoded-credentials",
      };

      expect(() => {
        middleware.use(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }).toThrow(UnauthorizedException);
    });
  });
});
