import { IMagicTokenRepository } from "@domain/repositories/magic-token.repository";
import { IUserRepository } from "@domain/repositories/user.repository";
import { CryptoService } from "@shared/utils/crypto.service";
import { JwtService } from "@shared/utils/jwt.service";
import { VerifyMagicLinkInputDto, VerifyMagicLinkOutputDto } from "./dto";
import { InvalidTokenError, UserNotFoundError } from "./errors";

export class VerifyMagicLinkUseCase {
  constructor(
    private magicTokenRepository: IMagicTokenRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    input: VerifyMagicLinkInputDto
  ): Promise<VerifyMagicLinkOutputDto> {
    const tokenHash = CryptoService.hashToken(input.token);

    const magicToken =
      await this.magicTokenRepository.findByTokenHash(tokenHash);

    if (!magicToken || !magicToken.isValid()) {
      throw new InvalidTokenError();
    }

    const user = await this.userRepository.findByEmail(magicToken.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.magicTokenRepository.markAsUsed(magicToken.id);

    const jwtToken = JwtService.sign({
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
    });

    return {
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        companyId: user.companyId,
        role: user.role,
      },
    };
  }
}
