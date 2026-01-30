import { ApiProperty } from "@nestjs/swagger";

export class CompanyResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id!: string;

  @ApiProperty({ example: "Clínica Exemplo" })
  name!: string;

  @ApiProperty({ example: "12.345.678/0001-90", nullable: true })
  cnpj?: string | null;

  @ApiProperty({ example: "2026-01-30T15:00:00.000Z" })
  createdAt!: string;

  @ApiProperty({ example: "2026-01-30T15:00:00.000Z", nullable: true })
  updatedAt?: string | null;
}
