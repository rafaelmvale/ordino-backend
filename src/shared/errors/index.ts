import { HttpException, HttpStatus } from "@nestjs/common";

export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends HttpException {
  constructor(message = "Validation error") {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: "Bad Request",
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class ConflictError extends HttpException {
  constructor(message = "Conflict") {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message,
        error: "Conflict",
      },
      HttpStatus.CONFLICT
    );
  }
}

export class NotFoundError extends HttpException {
  constructor(message = "Not found") {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message,
        error: "Not Found",
      },
      HttpStatus.NOT_FOUND
    );
  }
}

export class UnauthorizedError extends HttpException {
  constructor(message = "Unauthorized") {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message,
        error: "Unauthorized",
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}
