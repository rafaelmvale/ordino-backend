import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { IUserRepository } from "@domain/repositories/user.repository";
import { User } from "@domain/entities/user.entity";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.companyId,
      user.email,
      user.name,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.companyId,
      user.email,
      user.name,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }

  async create(data: {
    companyId: string;
    email: string;
    name?: string;
    role: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        companyId: data.companyId,
        email: data.email,
        name: data.name || null,
        role: data.role,
      },
    });

    return new User(
      user.id,
      user.companyId,
      user.email,
      user.name,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }
}
