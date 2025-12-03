# ARCH-01 — Decisão de Stack e Justificativa

## Decisão

Adotar **NestJS com adapter Fastify**, TypeScript, **Prisma + PostgreSQL**, Redis para cache e RabbitMQ para filas. Monólito modular com Clean/Hexagonal architecture

## Por que NestJS + Fastify

- **NestJS** fornece modularidade, DI e convenções que aceleram desenvolvimento e manutenção
- **Fastify** via adapter garante performance melhor que Express (~2x) e compatibilidade total com NestJS
- Facilita evolução para microservices (Nest tem suporte a transport adapters)
- TypeScript first-class, decorators, guards, pipes, interceptors
- Ecossistema maduro e documentação excelente

**Trade-off:** Overhead inicial vs Node puro, mas ganho em produtividade e manutenibilidade

---

## Banco de Dados

- **PostgreSQL 15** como banco primário (ACID, multi-tenancy, JSON/JSONB)
- **Prisma** como ORM:
  - Tipagem forte e type-safe
  - Migrations automáticas
  - Excelente DX (Prisma Studio)
  - Suporte nativo a PostgreSQL
  - Geração automática de tipos

**Alternativas consideradas:**
    - TypeORM: Mais bugs históricos, menos type-safe
    - Sequelize: Menos moderno, DX inferior
    - Knex: Query builder, sem ORM completo

---
 ##Estratégia de Backups (PostgreSQL)

- **Backups automáticos:** Cloud SQL automatic backups (diários, retenção 7 dias)
- **Backups manuais:** pg_dump via script antes de migrations críticas
- **Point-in-time recovery:** Habilitado no Cloud SQL
- **Backup de desenvolvimento:** Docker volumes (ordino_db_data) para dev local
- **Frequência produção:** Diário automático + antes de deploys major
- **Teste de restore:** Mensal (validar integridade dos backups)

---
 ##Mensageria e Cache

- **RabbitMQ** para filas e comunicação assíncrona (futuro)
- **Redis 7** para:
  - Cache de queries frequentes
  - Sessões de usuário
  - Rate limiting
  - Pub/Sub (futuro)

---

## Autenticação

- **Magic Link** (passwordless) com tokens JWT curtos
- Tabela `MagicToken` para one-time tokens
- JWT para sessões de longa duração após verificação

---

## Testes / Quality

- **Jest + ts-jest** para testes unitários e integração
- **ESLint v9 (flat config)** + Prettier para qualidade
- **Husky + lint-staged** para pre-commit hooks

---

## Deploy

- **Containers (Docker)** + Cloud Run (futuro)
- **CI:** GitHub Actions (já iniciado)
- Deploy manual via `workflow_dispatch` (temporário)

---
 ##Estrutura de Pastas (Clean/Hexagonal)
src/
├── domain/ # Entidades, value objects, interfaces (core)
│ ├── company/
│ ├── appointment/
│ └── ...
├── use-cases/ # Casos de uso (regras de negócio)
│ ├── create-appointment/
│ └── ...
├── infra/ # Adaptadores externos
│ ├── db/ # Prisma client, repositories impl
│ ├── http/ # Controllers, DTOs, middlewares
│ └── external/ # APIs externas, serviços
└── shared/ # Utils, erros, tipos comuns
├── errors/
├── utils/
└── logger.ts

---

## Custos Estimados (MVP - 100 usuários)

- **Cloud Run:** ~$10-30/mês (pay-per-use)
- **Cloud SQL (Postgres):** ~$25-50/mês (db-f1-micro)
- **Redis (Memorystore):** ~$30/mês (1GB)
- **Total estimado:** $65-110/mês
- **Escalabilidade:** Cloud Run escala automaticamente (0 a N instâncias)

---

## Segurança

- **Secrets:** GitHub Secrets + Workload Identity (futuro)
- **HTTPS only:** Cloud Run force HTTPS
- **Rate limiting:** Redis-based (implementar em Sprint 2)
- **SQL Injection:** Prisma protege via prepared statements
- **XSS/CSRF:** Headers de segurança via middleware
- **Logs:** Structured JSON logs com PII masking

---

## Trade-offs e Riscos

### Riscos Identificados

1. **Dependência do Prisma (lock-in do client)**
   - **Mitigação:** Interfaces de repositório no domain permitem trocar implementação

2. **Overhead inicial do NestJS vs Node puro**
   - **Mitigação:** Ganho em produtividade e manutenibilidade compensa

3. **Monolith modular pode ficar grande**
   - **Mitigação:** Arquitetura modular facilita extração para microservices depois

---

## Monolith Modular vs Microservices

**Decisão:** Começar com **Monolith Modular** (Clean Architecture)

**Justificativa:**
    - MVP não justifica complexidade de microservices
    - Time pequeno inicial (1-2 devs)
    - Deploy e debugging mais simples
    - Menor overhead operacional

**Evolução para Microservices:**
    - Quando: > 5 serviços independentes ou time > 5 devs
    - Como: Extrair módulos por domínio (appointments, payments, notifications)
    - NestJS facilita: transport adapters permitem evolução gradual

**Critérios de extração:**
    - Módulo com escala diferente (ex: notifications precisa de mais instâncias)
    - Time dedicado ao módulo
    - Necessidade de deploy independente

## Próximos Passos

- [x] Documento de decisão criado
- [ ] Criar scaffold CODE-01
- [ ] Modelagem ERD (ARCH-02)
- [ ] Definir OpenAPI (ARCH-03)
- [ ] Setup Prisma com schema inicial

---
