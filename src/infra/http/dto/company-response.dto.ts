export class CompanyResponseDto {
  id!: string;
  name!: string;
  cnpj?: string | null;
  createdAt!: string;
  updatedAt?: string | null;
}
