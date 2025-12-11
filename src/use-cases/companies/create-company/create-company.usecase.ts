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

    let sanitizedCnpj = payload.cnpj ?? null;
    if (sanitizedCnpj) {
      sanitizedCnpj = sanitizedCnpj.replace(/\D/g, "");
      if (sanitizedCnpj.length === 0) sanitizedCnpj = null;
    }

    if (sanitizedCnpj) {
      const existing = await this.companyRepo.findByCnpj(sanitizedCnpj);
      if (existing) throw new ConflictError("CNPJ já cadastrado");
    }

    const company = await this.companyRepo.create({
      name: payload.name.trim(),
      cnpj: sanitizedCnpj ?? null,
    });

    return company;
  }
}
