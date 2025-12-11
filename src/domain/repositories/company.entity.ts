import { Company } from "@domain/entities/company.entity";

export type CompanyCreateProps = {
  name: string;
  cnpj?: string | null;
};

export interface ICompanyRepository {
  create(props: CompanyCreateProps): Promise<Company>;
  findById(id: string): Promise<Company | null>;
  findByCnpj(cnpj: string): Promise<Company | null>;
  listAll(): Promise<Company[]>;
}
