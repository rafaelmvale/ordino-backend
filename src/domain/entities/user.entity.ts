export class User {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly email: string,
    public readonly name: string | null,
    public readonly role: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null
  ) {}
}
