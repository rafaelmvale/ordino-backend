import { Module } from "@nestjs/common";
import { HealthController } from "@infra/http/controllers/health.controller";
import { CompaniesController } from "@infra/http/controllers/companies.controller";
import { AuthController } from "@infra/http/controllers/auth.controller";
import { PrismaService } from "@infra/db/prisma.service";
import { PrismaCompanyRepository } from "@infra/db/prisma.company.repository";
import { PrismaUserRepository } from "@infra/db/prisma.user.repository";
import { PrismaMagicTokenRepository } from "@infra/db/prisma.magic-token.repository";
import { CreateCompanyUseCase } from "@use-cases/companies/create-company/create-company.usecase";
import { RequestMagicLinkUseCase } from "@use-cases/auth/request-magic-link";
import { VerifyMagicLinkUseCase } from "@use-cases/auth/verify-magic-link";

@Module({
  imports: [],
  controllers: [HealthController, CompaniesController, AuthController],
  providers: [
    PrismaService,
    PrismaCompanyRepository,
    PrismaUserRepository,
    PrismaMagicTokenRepository,
    {
      provide: CreateCompanyUseCase,
      useFactory: (repo: PrismaCompanyRepository) =>
        new CreateCompanyUseCase(repo),
      inject: [PrismaCompanyRepository],
    },
    {
      provide: RequestMagicLinkUseCase,
      useFactory: (magicTokenRepo: PrismaMagicTokenRepository) =>
        new RequestMagicLinkUseCase(magicTokenRepo),
      inject: [PrismaMagicTokenRepository],
    },
    {
      provide: VerifyMagicLinkUseCase,
      useFactory: (
        magicTokenRepo: PrismaMagicTokenRepository,
        userRepo: PrismaUserRepository
      ) => new VerifyMagicLinkUseCase(magicTokenRepo, userRepo),
      inject: [PrismaMagicTokenRepository, PrismaUserRepository],
    },
  ],
  exports: [
    PrismaService,
    PrismaCompanyRepository,
    PrismaUserRepository,
    PrismaMagicTokenRepository,
  ],
})
export class AppModule {}
