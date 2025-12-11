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

@Controller("companies")
export class CompaniesController {
  constructor(
    private createCompanyUseCase: CreateCompanyUseCase,
    private repo: PrismaCompanyRepository
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCompanyDto) {
    const company = await this.createCompanyUseCase.execute({
      name: dto.name,
      cnpj: dto.cnpj,
    });
    return company.toJSON();
  }

  @Get()
  async list() {
    const rows = await this.repo.listAll();
    return rows.map((r) => r.toJSON());
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const c = await this.repo.findById(id);
    if (!c) {
      throw new NotFoundError("Company not found");
    }
    return c.toJSON();
  }
}
