# ERD — Modelagem do Domínio (MVP)

## Visão Geral

Este documento descreve o modelo de dados do Ordino, focado em multi-tenant (por empresa), agendamentos, profissionais, serviços e pagamentos.

## Entidades Principais

    ### Company (Multi-tenant)
    - **Propósito:** Isolamento de dados por empresa/cliente
    - **Campos chave:** `id`, `name`, `cnpj`, `ownerId`
    - **Relacionamentos:** 1:N com Branch, User, Professional, Service, Customer, Appointment, Payment

    ### Branch (Filiais)
    - **Propósito:** Múltiplas unidades por empresa
    - **Campos chave:** `id`, `companyId`, `name`, `address`, `timezone`, `meta` (JSON para horários)
    - **Relacionamentos:** N:1 Company, 1:N Appointment

    ### User (Usuários Administrativos)
    - **Propósito:** Usuários do sistema (OWNER, ADMIN, STAFF)
    - **Campos chave:** `id`, `companyId`, `email` (unique), `role`
    - **Relacionamentos:** N:1 Company

    ### Professional (Profissionais)
    - **Propósito:** Profissionais que atendem (médicos, cabeleireiros, etc.)
    - **Campos chave:** `id`, `companyId`, `name`, `email`, `defaultDuration`
    - **Relacionamentos:** N:1 Company, N:M Service (via ProfessionalService), 1:N Appointment

    ### Service (Serviços)
    - **Propósito:** Serviços oferecidos (consulta, corte, etc.)
    - **Campos chave:** `id`, `companyId`, `name`, `duration`, `priceCents`
    - **Relacionamentos:** N:1 Company, N:M Professional (via ProfessionalService), 1:N Appointment

    ### ProfessionalService (Join Table)
    - **Propósito:** Relacionamento N:M entre Professional e Service com overrides
    - **Campos chave:** `professionalId`, `serviceId`, `duration` (override), `priceCents` (override)
    - **Unique:** `[professionalId, serviceId]`

    ### Customer (Clientes)
    - **Propósito:** Clientes que fazem agendamentos
    - **Campos chave:** `id`, `companyId`, `name`, `email`, `phone`
    - **Relacionamentos:** N:1 Company, 1:N Appointment

    ### Appointment (Agendamentos)
    - **Propósito:** Agendamentos de serviços
    - **Campos chave:** `id`, `companyId`, `branchId`, `professionalId`, `serviceId`, `customerId`, `startsAt`, `endsAt`, `status`
    - **Status:** SCHEDULED | CONFIRMED | CANCELLED | COMPLETED | NO_SHOW
    - **Relacionamentos:** N:1 Company, Branch, Professional, Service, Customer; 1:N Payment

    ### Payment (Pagamentos)
    - **Propósito:** Pagamentos associados a agendamentos
    - **Campos chave:** `id`, `companyId`, `appointmentId`, `amountCents`, `currency`, `status`, `provider`
    - **Status:** PENDING | PAID | FAILED | REFUNDED
    - **Relacionamentos:** N:1 Company, Appointment (nullable)

    ### Plan (Planos)
    - **Propósito:** Planos de assinatura (Free, Basic, Pro)
    - **Campos chave:** `id`, `name` (unique), `maxProfessionals`, `maxBranches`, `financialFeatures`, `priceCents`
    - **Relacionamentos:** 1:N CompanyPlan

    ### CompanyPlan (Plano Atual da Empresa)
    - **Propósito:** Plano ativo de cada empresa
    - **Campos chave:** `id`, `companyId` (unique), `planId`, `startedAt`, `expiresAt`, `active`
    - **Relacionamentos:** N:1 Company, Plan

    ### MagicToken
    - **Propósito:** Tokens para autenticação passwordless
    - **Campos chave:** `id`, `email`, `tokenHash` (unique), `expiresAt`, `used`

    ### AuditLog
    - **Propósito:** Log de auditoria de ações
    - **Campos chave:** `id`, `companyId`, `userId`, `action`, `data` (JSON), `createdAt`

## Decisões de Modelagem

    ### Multi-tenancy
    - **Abordagem:** `companyId` em todas as tabelas principais
    - **Isolamento:** Row-level security pode ser adicionado depois (PostgreSQL RLS)
    - **Escalabilidade:** Facilita sharding por empresa no futuro

    ### Cascade vs SetNull
    - **Cascade:** Company → Branch, User, Professional, Service, Customer (dados críticos)
    - **SetNull:** Appointment → Branch, Professional, Service, Customer (preservar histórico mesmo se deletados)
    - **SetNull:** Payment → Appointment (preservar histórico de pagamentos)

    ### Soft Deletes
    - **Decisão:** Não implementado no MVP
    - **Alternativa:** Usar `active` boolean (Professional, Service)
    - **Futuro:** Adicionar `deletedAt` se necessário

    ### Índices
    - **Foreign Keys:** Todos os `companyId`, `branchId`, `professionalId`, etc.
    - **Busca:** `email` em User, Professional, Customer
    - **Performance:** `startsAt` em Appointment (queries por data)
    - **Status:** `status` em Payment (filtros frequentes)

    ### Campos JSON
    - **Branch.meta:** Horários de funcionamento, configurações específicas
    - **AuditLog.data:** Dados adicionais da ação (flexível)

    ### Valores em Centavos
    - **Decisão:** `priceCents` e `amountCents` em centavos (evita problemas de ponto flutuante)
    - **Exemplo:** R$ 100,50 = 10050 centavos

## Relacionamentos Complexos

    ### Professional ↔ Service (N:M)
    - Via `ProfessionalService` com overrides
    - Permite que um profissional tenha preço/duração diferente por serviço
    - Exemplo: Profissional pode fazer corte em 30min (padrão) mas barba em 15min (override)

    ### Appointment (Flexível)
    - Todos os relacionamentos são opcionais (`?`)
    - Permite agendamentos sem profissional específico (ex: "qualquer disponível")
    - Permite agendamentos sem serviço específico (ex: "consulta geral")

## Próximos Passos

1. ✅ Schema Prisma criado
2. ✅ Migration aplicada
3. ⏳ ERD gráfico gerado (dbdiagram.io ou similar)
4. ⏳ Seed data para desenvolvimento
5. ⏳ Validações de negócio (ex: não permitir agendamentos no passado)
