import { MagicToken } from "@domain/entities/magic-token.entity";

export interface IMagicTokenRepository {
  create(data: {
    email: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<MagicToken>;
  findByTokenHash(tokenHash: string): Promise<MagicToken | null>;
  markAsUsed(id: string): Promise<void>;
}
