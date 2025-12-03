#!/usr/bin/env bash

# create-issues.sh
# Requires: gh CLI authenticated and repo set (gh repo set or run from repo dir)
set -euo pipefail

# Issues data: title|labels|body (use '\n' for newlines in body)
issues=(
"PV-01 — Documentar Visão do Produto, Público-Alvo e MVP|epic,design,priority:high,sprint:0|Escrever documento que descreva visão do produto, segmentos alvo e MVP.

Tarefas:
- [ ] Escrever visão do produto (1 página)
- [ ] Listar segmentos alvo e necessidades específicas
- [ ] Definir MVP (must-have) e MLP (marketable)
- [ ] Definir KPIs iniciais (churn, MRR, CAC estimado)

Critérios de aceitação: Documento revisado e aprovado por PO."

"PV-02 — Roadmap 6 meses (temas e milestones)|epic,design,priority:medium,sprint:0|Criar roadmap de 3-4 releases (quarterly), priorizando agendamento, financeiro, white-label e multi-filial.

Tarefas:
- [ ] Criar timeline com releases e objetivos
- [ ] Mapear dependências (legal, integrações, infra)

Critérios: Roadmap no README / project board."

"ARCH-01 — Escolher stack e justificar decisões|epic,backend,priority:high,sprint:0|Documentar stack (Node.js, TypeScript, NestJS? ou minimal libs), DB primário (Postgres), NoSQL (Mongo) para casos, message broker (RabbitMQ opcional), cache Redis. Arquitetura hexagonal + Clean Architecture.

Tarefas:
- [ ] Escolher stack e justificar (performance, hiring, cost)
- [ ] Definir DB primário e modelo de backups
- [ ] Definir approach para microservices vs monolith modular

Critérios: Documento de decisões arquit."

"ARCH-02 — Modelagem inicial do domínio (ERD)|epic,backend,priority:high,sprint:0|Modelar entidades principais: Company, Branch, User, Professional, Customer, Service, Appointment, Payment, Plan, Tenant (for white-label).

Tarefas:
- [ ] ERD com atributos principais e relacionamentos
- [ ] Definir exemplos de dados
- [ ] Exportar diagrama PNG/SVG

Critérios: ERD anexado ao repo / docs."

"ARCH-03 — Definir contratos API (OpenAPI/Swagger minimal)|epic,backend,priority:high,sprint:0|Criar contrato OpenAPI para endpoints iniciais: auth/login (magic link), health, appointments CRUD, company settings.

Tarefas:
- [ ] Swagger minimal com paths + schemas
- [ ] Publicar doc local via swagger-ui (dev)

Critérios: arquivo openapi.yaml em /docs."

"CODE-01 — Criar scaffold do backend (estrutura Clean/Hexagonal)|epic,backend,priority:high,sprint:0|Criar estrutura de pastas conforme especificação do projeto (domain, use-cases, infra/db, infra/http/controllers, shared, errors). Incluir README de arquitetura.

Tarefas:
- [ ] Criar árvore de diretórios
- [ ] Adicionar main.ts, app.module.ts (ou equivalente se não usar Nest)
- [ ] Health endpoint /healthz
- [ ] Seed script básico para env dev

Critérios: App inicial roda npm run dev e responde health."

"CODE-02 — Configurar TypeScript, tsconfig.build.json|backend,priority:high,sprint:0|Configurar tsconfig.json e tsconfig.build.json adequado para produção.

Tarefas:
- [ ] tsconfig.json dev
- [ ] tsconfig.build.json para build
- [ ] Ajustar scripts package.json (build, start, dev, lint, test)

Critérios: npm run build funciona."

"CODE-03 — ESLint, Prettier, Husky, lint-staged|backend,priority:high,sprint:0|Garantir rules (ESLint v9 flat config), Prettier e pre-commit hooks com lint-staged.

Tarefas:
- [ ] Adicionar eslint.config.cjs
- [ ] Adicionar .prettierrc
- [ ] Adicionar Husky pre-commit para lint-staged

Critérios: git commit bloqueia commit com erros."

"CODE-04 — Jest + ts-jest + smoke test|backend,priority:high,sprint:0|Configurar testes unitários com Jest e um teste inicial (smoke test criado).

Tarefas:
- [ ] jest.config.js com ts-jest
- [ ] src/__tests__/smoke.test.ts

Critérios: npm test passa local."

"DEVOPS-01 — Pipeline CI (GitHub Actions) — lint/build/test|epic,devops,priority:high,sprint:0|CI com Steps: checkout, setup-node, npm ci (with package-lock), lint, build, test. Garantir caches e artefatos.

Tarefas:
- [ ] Criar .github/workflows/ci.yml
- [ ] Configurar cache npm
- [ ] Expor artefatos (optional)

Critérios: CI verde em PRs."

"DEVOPS-02 — Deploy manual (workflow_dispatch) placeholder|devops,priority:medium,sprint:0|Criar deploy-manual.yml com placeholders e segurança (manual run only). Cloud Run integration will be added later.

Tarefas:
- [ ] deploy-manual.yml criado
- [ ] Documentar steps de deploy (what to fill later)

Critérios: Manual workflow appears in Actions."

"DEVOPS-03 — Secrets & policies doc|devops,priority:medium,sprint:0|Documentar secrets required, how to create SA, roles, and rotate keys.

Tarefas:
- [ ] Document secrets list
- [ ] Provide revocation steps

Critérios: Document in docs/infra.md."

"SEC-01 — Basic logging and observability plan|epic,devops,priority:medium,sprint:0|Define logging strategy (structured logs), error tracking (Sentry optional), metrics (Prometheus or Cloud Monitoring).

Tarefas:
- [ ] Logging strategy doc
- [ ] Add minimal middleware for request logging

Critérios: Logs structured JSON, request id support."

"SEC-02 — Secrets handling and vault plan|security,priority:medium,sprint:0|Plan for secrets management (GitHub Secrets + Gateways).

Tarefas:
- [ ] Document approach (Workload Identity later)
- [ ] Add instructions for rotating SA keys

Critérios: Docs in docs/security.md."

"UX-01 — Wireframes text-based (Web admin + Client portal)|epic,design,priority:medium,sprint:0|Generate wireframes in text for Admin Dashboard, Client Booking page, Professional portal.

Tarefas:
- [ ] Admin: Dashboard, Appointments, Finance, Settings (white-label)
- [ ] Client: Booking flow, reschedule, cancel, invoice
- [ ] Professional: Schedule, status, earnings

Critérios: Wireframes in /docs/wireframes.md."

"UX-02 — Branding minimal / white-label concept|design,priority:low,sprint:0|Create minimal brand guide: logo, colors, font, white-label variables.

Tarefas:
- [ ] Minimal style guide (colors, typography)
- [ ] Placeholder logo (Ordino)

Critérios: docs/brand.md with SVG logo."

"PB-01 — Create Sprint 1 backlog (top 8 stories)|epic,product,priority:high,sprint:0|Prioritize first sprint stories: auth (magic link), booking create/list, company setup, basic payment placeholders.

Tarefas:
- [ ] Write 8 user stories with acceptance criteria
- [ ] Estimate each (T-shirt/points)

Critérios: Sprint 1 board ready."
)

echo "Creating ${#issues[@]} issues via gh..."

for entry in "${issues[@]}"; do
  title="${entry%%|*}"
  rest="${entry#*|}"
  labels="${rest%%|*}"
  body="${rest#*|}"

  echo "Creating issue: $title (labels: $labels)"
  gh issue create --title "$title" --body "$body" --label "$labels" || echo "Failed to create: $title"
done

echo "Done. Created ${#issues[@]} issues."