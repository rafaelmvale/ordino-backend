import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { RequestMagicLinkUseCase } from "@use-cases/auth/request-magic-link";
import { VerifyMagicLinkUseCase } from "@use-cases/auth/verify-magic-link";
import { RequestMagicLinkDto } from "../dto/request-magic-link.dto";
import { VerifyMagicLinkDto } from "../dto/verify-magic-link.dto";
import {
  AuthResponseDto,
  MagicLinkResponseDto,
} from "../dto/auth-response.dto";
import { InvalidEmailError } from "@use-cases/auth/request-magic-link/errors";
import {
  InvalidTokenError,
  UserNotFoundError,
} from "@use-cases/auth/verify-magic-link/errors";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private requestMagicLinkUseCase: RequestMagicLinkUseCase,
    private verifyMagicLinkUseCase: VerifyMagicLinkUseCase
  ) {}

  @Post("magic-link")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request magic link" })
  @ApiBody({ type: RequestMagicLinkDto })
  @ApiResponse({
    status: 200,
    description: "Magic link sent",
    type: MagicLinkResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid email" })
  async requestMagicLink(
    @Body() body: RequestMagicLinkDto
  ): Promise<MagicLinkResponseDto> {
    try {
      const result = await this.requestMagicLinkUseCase.execute({
        email: body.email,
      });

      return result;
    } catch (error) {
      if (error instanceof InvalidEmailError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get("verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify magic link token and create session" })
  @ApiResponse({
    status: 200,
    description: "Authenticated, returns JWT session",
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: "Invalid or expired token" })
  async verifyMagicLink(
    @Query() query: VerifyMagicLinkDto
  ): Promise<AuthResponseDto> {
    try {
      const result = await this.verifyMagicLinkUseCase.execute({
        token: query.token,
      });

      return result;
    } catch (error) {
      if (
        error instanceof InvalidTokenError ||
        error instanceof UserNotFoundError
      ) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
