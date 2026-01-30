import { User } from "@domain/entities/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: {
    companyId: string;
    email: string;
    name?: string;
    role: string;
  }): Promise<User>;
}
