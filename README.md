# Ordino — Backend (scaffold)

Estrutura inicial do backend do Ordino. Arquitetura hexagonal com NestJS + Fastify.

Principais pastas:
  src/domain: entidades e contratos (interfaces)
  src/use-cases: casos de uso (regras de negócio)
  src/infra: infra adapters (db, repos, http controllers)
  src/shared: utils, logger, erros

Como usar (exemplo de fluxo):
1.Configure variáveis de ambiente (DATABASE_URL, REDIS_URL).
2.Crie a base Postgres (use o arquivo migrations/001_init.sql).
3.Suba os serviços (db/redis) no Docker Compose (dev).
4.Inicie a aplicação em modo dev (watch) ou construa e rode dist.

Arquitetura e próximos passos:
  adicionar validação DTO + pipes no Nest
  adicionar unit tests e e2e tests
  integrar lint, prettier, commit hooks
  implementar migrations automatizadas (Flyway/Knex)
  adicionar health checks, metrics e tracing
