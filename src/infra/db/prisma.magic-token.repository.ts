import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { IMagicTokenRepository } from "@domain/repositories/magic-token.repository";
import { MagicToken } from "@domain/entities/magic-token.entity";

@Injectable()
export class PrismaMagicTokenRepository implements IMagicTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<MagicToken> {
    const token = await this.prisma.magicToken.create({
      data: {
        email: data.email,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });

    return new MagicToken(
      token.id,
      token.email,
      token.tokenHash,
      token.expiresAt,
      token.used,
      token.createdAt
    );
  }

  async findByTokenHash(tokenHash: string): Promise<MagicToken | null> {
    const token = await this.prisma.magicToken.findUnique({
      where: { tokenHash },
    });

    if (!token) return null;

    return new MagicToken(
      token.id,
      token.email,
      token.tokenHash,
      token.expiresAt,
      token.used,
      token.createdAt
    );
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.magicToken.update({
      where: { id },
      data: { used: true },
    });
  }
}
