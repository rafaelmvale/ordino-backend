import * as crypto from "crypto";

export class CryptoService {
  static generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  static hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
