import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name!: string;

  @IsOptional()
  @IsString()
  cnpj?: string;
}
