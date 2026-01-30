export class MagicToken {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly tokenHash: string,
    public readonly expiresAt: Date,
    public readonly used: boolean,
    public readonly createdAt: Date
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.used && !this.isExpired();
  }
}
