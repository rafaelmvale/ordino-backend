import { Company } from "@domain/entities/company.entity";
import {
  CompanyCreateProps,
  ICompanyRepository,
} from "@domain/repositories/company.entity";
import { ConflictError, ValidationError } from "@shared/errors";

export class CreateCompanyUseCase {
  constructor(private companyRepo: ICompanyRepository) {}

  async execute(payload: CompanyCreateProps): Promise<Company> {
    if (!payload.name || payload.name.trim().length < 2) {
      throw new ValidationError("Nome inválido");
    }

    if (payload.cnpj) {
      const existing = await this.companyRepo.findByCnpj(payload.cnpj);
      if (existing) {
        throw new ConflictError("CNPJ já cadastrado");
      }
    }

    const company = await this.companyRepo.create({
      name: payload.name.trim(),
      cnpj: payload.cnpj ?? null,
    });

    return company;
  }
}
