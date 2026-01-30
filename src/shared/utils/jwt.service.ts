import { sign, verify } from "jsonwebtoken";
import { config } from "../../config";

export interface JwtPayload {
  userId: string;
  email: string;
  companyId: string;
  role: string;
}

export class JwtService {
  static sign(payload: JwtPayload): string {
    return sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as string,
    } as any);
  }

  static verify(token: string): JwtPayload {
    return verify(token, config.jwt.secret) as JwtPayload;
  }
}
