import { IMagicTokenRepository } from "@domain/repositories/magic-token.repository";
import { CryptoService } from "@shared/utils/crypto.service";
import { config } from "../../../config";
import { RequestMagicLinkInputDto, RequestMagicLinkOutputDto } from "./dto";
import { InvalidEmailError } from "./errors";
import { logger } from "@shared/logger";

export class RequestMagicLinkUseCase {
  constructor(private magicTokenRepository: IMagicTokenRepository) {}

  async execute(
    input: RequestMagicLinkInputDto
  ): Promise<RequestMagicLinkOutputDto> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      throw new InvalidEmailError();
    }

    const token = CryptoService.generateToken();
    const tokenHash = CryptoService.hashToken(token);

    const expiresInMs = this.parseExpiration(config.magicLink.expiresIn);
    const expiresAt = new Date(Date.now() + expiresInMs);

    await this.magicTokenRepository.create({
      email: input.email.toLowerCase(),
      tokenHash,
      expiresAt,
    });

    logger.info(
      {
        email: input.email,
        token,
        expiresAt,
      },
      "Magic link generated (DEV ONLY - remove in production)"
    );

    return {
      message: "Magic link sent",
    };
  }

  private parseExpiration(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 60 * 1000;

    const [, value, unit] = match;
    const num = parseInt(value, 10);

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return num * (multipliers[unit] || 1000);
  }
}
