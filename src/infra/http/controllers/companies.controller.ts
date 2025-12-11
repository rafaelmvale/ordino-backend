import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CreateCompanyDto } from "../dto/create-company.dto";
import { CreateCompanyUseCase } from "../../../use-cases/companies/create-company/create-company.usecase";
import { PrismaCompanyRepository } from "../../db/prisma.company.repository";
import { NotFoundError } from "../../../shared/errors";
import { CompanyResponseDto } from "../dto/company-response.dto";

@Controller("companies")
export class CompaniesController {
  constructor(
    private createCompanyUseCase: CreateCompanyUseCase,
    private repo: PrismaCompanyRepository
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCompanyDto): Promise<CompanyResponseDto> {
    const company = await this.createCompanyUseCase.execute({
      name: dto.name,
      cnpj: dto.cnpj,
    });

    return {
      id: company.id!,
      name: company.name,
      cnpj: company.cnpj ?? null,
      createdAt: company.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: company.updatedAt ? company.updatedAt.toISOString() : null,
    };
  }

  @Get()
  async list(): Promise<CompanyResponseDto[]> {
    const rows = await this.repo.listAll();
    return rows.map((c) => ({
      id: c.id!,
      name: c.name,
      cnpj: c.cnpj ?? null,
      createdAt: c.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: c.updatedAt ? c.updatedAt.toISOString() : null,
    }));
  }

  @Get(":id")
  async get(@Param("id") id: string): Promise<CompanyResponseDto> {
    const c = await this.repo.findById(id);
    if (!c) {
      throw new NotFoundError("Company not found");
    }
    return {
      id: c.id!,
      name: c.name,
      cnpj: c.cnpj ?? null,
      createdAt: c.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: c.updatedAt ? c.updatedAt.toISOString() : null,
    };
  }
}
