import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCompanyDto {
  @ApiProperty({
    description: "Company name",
    example: "Clínica Teste 2",
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name!: string;

  @ApiProperty({
    description: "Company CNPJ",
    example: "98.765.432/0001-00",
    required: false,
  })
  @IsOptional()
  @IsString()
  cnpj?: string;
}
