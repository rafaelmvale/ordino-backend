import { Module } from "@nestjs/common";
import { HealthController } from "@infra/http/controllers/health.controller";
import { CompaniesController } from "@infra/http/controllers/companies.controller";
import { PrismaService } from "@infra/db/prisma.service";
import { PrismaCompanyRepository } from "@infra/db/prisma.company.repository";
import { CreateCompanyUseCase } from "@use-cases/companies/create-company/create-company.usecase";

@Module({
  imports: [],
  controllers: [HealthController, CompaniesController],
  providers: [
    PrismaService,
    PrismaCompanyRepository,
    {
      provide: CreateCompanyUseCase,
      useFactory: (repo: PrismaCompanyRepository) =>
        new CreateCompanyUseCase(repo),
      inject: [PrismaCompanyRepository],
    },
  ],
  exports: [PrismaService, PrismaCompanyRepository],
})
export class AppModule {}
