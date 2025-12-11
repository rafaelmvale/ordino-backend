import { Company } from "@domain/entities/company.entity";
import {
  CompanyCreateProps,
  ICompanyRepository,
} from "@domain/repositories/company.entity";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private prisma: PrismaService) {}

  async create(companyProps: CompanyCreateProps): Promise<Company> {
    const data = {
      name: companyProps.name,
      cnpj: companyProps.cnpj ?? null,
    };

    const created = await this.prisma.company.create({ data });

    return new Company({
      id: created.id,
      name: created.name,
      cnpj: created.cnpj ?? undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async findById(id: string): Promise<Company | null> {
    const c = await this.prisma.company.findUnique({ where: { id } });
    if (!c) return null;

    return new Company({
      id: c.id,
      name: c.name,
      cnpj: c.cnpj ?? undefined,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    });
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const c = await this.prisma.company.findFirst({ where: { cnpj } });
    if (!c) return null;

    return new Company({
      id: c.id,
      name: c.name,
      cnpj: c.cnpj ?? undefined,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    });
  }

  async listAll(): Promise<Company[]> {
    const rows = await this.prisma.company.findMany();
    return rows.map(
      (r) =>
        new Company({
          id: r.id,
          name: r.name,
          cnpj: r.cnpj ?? undefined,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })
    );
  }
}
