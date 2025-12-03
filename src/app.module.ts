import { Module } from "@nestjs/common";
import { HealthController } from "@infra/http/controllers/health.controller";
import { PrismaService } from "@infra/db/prisma.service";

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
