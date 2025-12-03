# Sprint 0 — Ordino (Opção C) — Backlog Completo

## Visão rápida

Preparar o terreno: arquitetura hexagonal / clean architecture, CI/CD, qualidade (lint, tests), infra dev (Docker) e product design (MVP, UX flows, data model). Garantir que o projeto esteja pronto para começar as sprints de features sem blockers.

### Objetivos principais

- Estruturar repositório conforme padrão clean/hexagonal.
- Ter CI rodando (lint, build, test).
- Definir modelos de dados e contratos iniciais.
- Criar backlog de epics e stories para os próximos 3 sprints.
- Documentação inicial (README, CONTRIBUTING, ROADMAP).
- Criar scaffold do backend e primeira rota health-check.

---

 #Epics & Issues

> Use labels: `epic`, `backend`, `infra`, `design`, `devops`, `docs`, `research`, `priority:high|medium|low`, `sprint:0`

---

## EPIC: Product Vision & Roadmap

**Labels:** epic, design, priority:high, sprint:0

### ISSUE: PV-01 — Documentar Visão do Produto, Público-Alvo e MVP

**Descrição:** Escrever documento que descreva visão do produto, segmentos alvo (clínicas, contabilidade, restaurantes, salões), proposta de valor, e escopo do MVP (features obrigatórias vs nice-to-have).  

**Tarefas:**

- [ ] Escrever visão do produto (1 página)
- [ ] Listar segmentos alvo e necessidades específicas
- [ ] Definir MVP (must-have) e MLP (marketable)
- [ ] Definir KPIs iniciais (churn, MRR, CAC estimado)

**Critérios de aceitação:** Documento revisado e aprovado por PO (você).  

**Est / Prioridade:** 3d / high

### ISSUE: PV-02 — Roadmap 6 meses (temas e milestones)

**Descrição:** Criar roadmap de 3-4 releases (quarterly), priorizando agendamento, financeiro, white-label e multi-filial.  

**Tarefas:**

- [ ] Criar timeline com releases e objetivos
- [ ] Mapear dependências (legal, integrações, infra)

**Critérios:** Roadmap no README / project board.  

**Est / Prioridade:** 2d / medium

---

## EPIC: Architecture & Domain Modeling

**Labels:** epic, backend, priority:high, sprint:0

### ISSUE: ARCH-01 — Escolher stack e justificar decisões

**Descrição:** Documentar stack (Node.js, TypeScript, NestJS? ou minimal libs), DB primário (Postgres), NoSQL (Mongo) para casos, message broker (RabbitMQ opcional), cache Redis. Arquitetura hexagonal + Clean Architecture.  

**Tarefas:**

- [ ] Escolher stack e justificar (performance, hiring, cost)
- [ ] Definir DB primário e modelo de backups
- [ ] Definir approach para microservices vs monolith modular

**Critérios:** Documento de decisões arquit.  

**Est / Prioridade:** 1d / high

### ISSUE: ARCH-02 — Modelagem inicial do domínio (ERD)

**Descrição:** Modelar entidades principais: Company, Branch, User, Professional, Customer, Service, Appointment, Payment, Plan, Tenant (for white-label).  

**Tarefas:**

- [ ] ERD com atributos principais e relacionamentos
- [ ] Definir exemplos de dados
- [ ] Exportar diagrama PNG/SVG

**Critérios:** ERD anexado ao repo / docs.  

**Est / Prioridade:** 2d / high

### ISSUE: ARCH-03 — Definir contratos API (OpenAPI/Swagger minimal)

**Descrição:** Criar contrato OpenAPI para endpoints iniciais: auth/login (magic link), health, appointments CRUD, company settings.  

**Tarefas:**

- [ ] Swagger minimal com paths + schemas
- [ ] Publicar doc local via swagger-ui (dev)

**Critérios:** arquivo `openapi.yaml` em `/docs`.  

**Est / Prioridade:** 2d / high

---

## EPIC: Repo Scaffold & Code Standards

**Labels:** epic, backend, infra, devops, sprint:0

### ISSUE: CODE-01 — Criar scaffold do backend (estrutura Clean/Hexagonal)

**Descrição:** Criar estrutura de pastas conforme especificação do projeto (domain, use-cases, infra/db, infra/http/controllers, shared, errors). Incluir `README` de arquitetura.  

**Tarefas:**

- [ ] Criar árvore de diretórios
- [ ] Adicionar `main.ts`, `app.module.ts` (ou equivalente se não usar Nest)
- [ ] Health endpoint `/healthz`
- [ ] Seed script básico para env dev

**Critérios:** App inicial roda `npm run dev` e responde health.  

**Est / Prioridade:** 2d / high

### ISSUE: CODE-02 — Configurar TypeScript, tsconfig.build.json

**Descrição:** Configurar `tsconfig.json` e `tsconfig.build.json` adequado para produção.  

**Tarefas:**

- [ ] `tsconfig.json` dev
- [ ] `tsconfig.build.json` para build
- [ ] Ajustar scripts package.json (build, start, dev, lint, test)

**Critérios:** `npm run build` funciona.  

**Est / Prioridade:** 0.5d / high

### ISSUE: CODE-03 — ESLint, Prettier, Husky, lint-staged

**Descrição:** Garantir rules (ESLint v9 flat config), Prettier e pre-commit hooks com lint-staged.  

**Tarefas:**

- [ ] Adicionar `eslint.config.cjs`
- [ ] Adicionar `.prettierrc`
- [ ] Adicionar Husky `pre-commit` para `lint-staged`

**Critérios:** `git commit` bloqueia commit com erros.  

**Est / Prioridade:** 0.5d / high

### ISSUE: CODE-04 — Jest + ts-jest + smoke test

**Descrição:** Configurar testes unitários com Jest e um teste inicial (smoke test criado).  

**Tarefas:**

- [ ] `jest.config.js` com ts-jest
- [ ] `src/__tests__/smoke.test.ts`

**Critérios:** `npm test` passa local.  

**Est / Prioridade:** 0.5d / high

---

## EPIC: CI/CD & DevOps (sem deploy automático)

**Labels:** epic, devops, priority:high, sprint:0

### ISSUE: DEVOPS-01 — Pipeline CI (GitHub Actions) — lint/build/test

**Descrição:** CI com Steps: checkout, setup-node, npm ci (with package-lock), lint, build, test. Garantir caches e artefatos.  

**Tarefas:**

- [ ] Criar `.github/workflows/ci.yml`
- [ ] Configurar cache npm
- [ ] Expor artefatos (optional)

**Critérios:** CI verde em PRs.  

**Est / Prioridade:** 1d / high

### ISSUE: DEVOPS-02 — Deploy manual (workflow_dispatch) placeholder

**Descrição:** Criar `deploy-manual.yml` com placeholders e segurança (manual run only). Cloud Run integration will be added later.  

**Tarefas:**

- [ ] `deploy-manual.yml` criado (as we did)
- [ ] Documentar steps de deploy (what to fill later)

**Critérios:** Manual workflow appears in Actions.  

**Est / Prioridade:** 0.5d / medium

### ISSUE: DEVOPS-03 — Secrets & policies doc

**Descrição:** Documentar secrets required, how to create SA, roles, and rotate keys.  

**Tarefas:**

- [ ] Document secrets list
- [ ] Provide revocation steps

**Critérios:** Document in `docs/infra.md`.  

**Est / Prioridade:** 0.5d / medium

---

## EPIC: Security, Compliance & Observability

**Labels:** epic, devops, priority:medium, sprint:0

### ISSUE: SEC-01 — Basic logging and observability plan

**Descrição:** Define logging strategy (structured logs), error tracking (Sentry optional), metrics (Prometheus or Cloud Monitoring).  

**Tarefas:**

- [ ] Logging strategy doc
- [ ] Add minimal middleware for request logging

**Critérios:** Logs structured JSON, request id support.  

**Est / Prioridade:** 1d / medium

### ISSUE: SEC-02 — Secrets handling and vault plan

**Descrição:** Plan for secrets management (GitHub Secrets + Gateways).  

**Tarefas:**

- [ ] Document approach (Workload Identity later)
- [ ] Add instructions for rotating SA keys

**Critérios:** Docs in `docs/security.md`.  

**Est / Prioridade:** 0.5d / medium

---

## EPIC: UX / UI / Wireframes (Product)

**Labels:** epic, design, priority:medium, sprint:0

### ISSUE: UX-01 — Wireframes text-based (Web admin + Client portal)

**Descrição:** Generate wireframes in text for Admin Dashboard, Client Booking page, Professional portal.  

**Tarefas:**

- [ ] Admin: Dashboard, Appointments, Finance, Settings (white-label)
- [ ] Client: Booking flow, reschedule, cancel, invoice
- [ ] Professional: Schedule, status, earnings

**Critérios:** Wireframes in `/docs/wireframes.md`.  

**Est / Prioridade:** 1.5d / medium

### ISSUE: UX-02 — Branding minimal / white-label concept

**Descrição:** Create minimal brand guide: logo, colors, font, white-label variables.  

**Tarefas:**

- [ ] Minimal style guide (colors, typography)
- [ ] Placeholder logo (Ordino)

**Critérios:** `docs/brand.md` with SVG logo.  

**Est / Prioridade:** 1d / low

---

## EPIC: Product Backlog Prep (Stories first sprint)

**Labels:** epic, product, priority:high, sprint:0

### ISSUE: PB-01 — Create Sprint 1 backlog (top 8 stories)

**Descrição:** Prioritize first sprint stories: auth (magic link), booking create/list, company setup, basic payment placeholders.  

**Tarefas:**

- [ ] Write 8 user stories with acceptance criteria
- [ ] Estimate each (T-shirt/points)

**Critérios:** Sprint 1 board ready.  

**Est / Prioridade:** 1d / high

---

 #Definition of Done (DoD) for Sprint 0

- Code scaffold checked in and buildable (`npm ci && npm run build`).  
- CI passes for PR (lint/build/test).  
- OpenAPI minimal doc exists.  
- ERD + wireframes committed.  
- README with setup steps (local dev) added.  
- Project board created with Epics and Issues.  

---

 #Labels recommended

- epic, backend, frontend, infra, devops, design, docs, research, security, ux, product
- priority:high, priority:medium, priority:low
- sprint:0, sprint:1, sprint:backlog

---

 #Roadmap quick view (after Sprint 0)

- Sprint 1: Core booking + auth + company onboarding + DB + tests.
- Sprint 2: Payments, invoices, basic dashboard, white-label basics.
- Sprint 3: Multi-branch, scheduling advanced rules, notifications (WhatsApp), IA integration POC.

---

 #End of sprint0.md
