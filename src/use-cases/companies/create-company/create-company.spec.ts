import { CreateCompanyUseCase } from "@use-cases/companies/create-company/create-company.usecase";
import { Company } from "@domain/entities/company.entity";
import { ConflictError, ValidationError } from "@shared/errors";
import { ICompanyRepository } from "@domain/repositories/company.entity";

class FakeRepo implements ICompanyRepository {
  data: any[] = [];

  async findByCnpj(cnpj: string) {
    const found = this.data.find((d) => d.cnpj === cnpj);
    return found ? new Company(found) : null;
  }

  async create(payload: any) {
    const item = {
      id: "uuid",
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.data.push(item);
    return new Company(item);
  }

  async findById(id: string) {
    const found = this.data.find((d) => d.id === id);
    return found ? new Company(found) : null;
  }

  async listAll() {
    return this.data.map((d) => new Company(d));
  }
}

describe("CreateCompanyUseCase", () => {
  it("should create a company", async () => {
    const repo = new FakeRepo();
    const uc = new CreateCompanyUseCase(repo);
    const company = await uc.execute({ name: "Clinic A", cnpj: "123" });

    expect(company).toBeTruthy();
    expect(company.name).toBe("Clinic A");
    expect(company).toBeInstanceOf(Company);
  });

  it("should not allow duplicate cnpj", async () => {
    const repo = new FakeRepo();
    repo.data.push({
      id: "1",
      name: "Company X",
      cnpj: "111",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const uc = new CreateCompanyUseCase(repo);
    await expect(
      uc.execute({
        name: "Company Y",
        cnpj: "111",
      })
    ).rejects.toThrow(ConflictError);
  });

  it("should throw ValidationError for invalid name", async () => {
    const repo = new FakeRepo();
    const uc = new CreateCompanyUseCase(repo);

    await expect(uc.execute({ name: "A" })).rejects.toThrow(ValidationError);
    await expect(uc.execute({ name: "" })).rejects.toThrow(ValidationError);
  });

  it("should sanitize CNPJ (remove non-digits)", async () => {
    const repo = new FakeRepo();
    const uc = new CreateCompanyUseCase(repo);
    const company = await uc.execute({
      name: "Clinic A",
      cnpj: "12.345.678/0001-90",
    });

    expect(company.cnpj).toBe("12345678000190");
  });

  // Teste para CNPJ vazio após sanitização
  it("should set CNPJ to null if only non-digits", async () => {
    const repo = new FakeRepo();
    const uc = new CreateCompanyUseCase(repo);
    const company = await uc.execute({
      name: "Clinic A",
      cnpj: "---",
    });

    expect(company.cnpj).toBeNull();
  });
});
