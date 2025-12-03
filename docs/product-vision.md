# Ordino — Product Vision, Público-Alvo e MVP

 ##1. Visão do produto
Ordino é uma plataforma modular de gestão e agendamento para PMEs que organiza operações administrativas (agendamentos, financeiro, faturamento, relatórios, white-label e multi-filial) em um produto escalável e personalizável, com foco inicial em clínicas de saúde, contabilidades, salões de beleza, restaurantes e etc.
Slogan: **Ordino — Organize. Controle. Cresça.**

 ##2. Problema que resolvemos
-Empresas pequenas e médias perdem tempo com processos manuais de agendamento e financeiro.
-Muitos sistemas são caros, complexos ou não adaptáveis por segmento.
-Controle multi-filial, branding white-label e automações financeiras simples são raros num produto único.

 ##3. Público-alvo (segmentos iniciais)
**Primários (MVP target):**
-Clínicas de saúde (médicas, fisioterapia, pequenas clínicas) — precisa de reservas com durações diferentes, gestão de profissionais e integração com pagamentos/recibos.
-Contabilidades — agendamento de reuniões, gestão de clientes, faturamento e lembretes.
-Restaurantes (reservas e gestão de turnos simples) — foco em reservas e limite de capacidade.

**Secundários (plano futuro):**
-Salões de beleza e barbearias (alto fit já pensado pelo fluxo de profissionais).
-Consultorias empresariais (agendamentos + cobrança por horas).

Para cada segmento: listar dores específicas (ex.: NF/e, recibos para contadores, pacientes com agendamentos recorrentes, limites por sala/mesa).

 ##4. Proposta de valor
-**Centralização**: agendamento + financeiro + administração em um único painel.
-**White-label**: cliente final com portal próprio e domínio personalizado.
-**Escalável**: suporte a múltiplas filiais e limites por planos.
-**Automação simples**: cobranças, confirmações via WhatsApp, lembretes por link mágico.
-**IA integrada**: ajudante para dúvidas, confirmação automática de agendamentos e resumos.

 ##5. MVP — funcionalidades mínimas (must-have)
1.**Onboarding de empresa**: criação de conta, dados da empresa, configuração de filial única/varias.
2.**Autenticação**: magic link (login por link) + administração básica.
3.**Agendamentos**: CRUD de appointments, horários, duração por serviço.
4.**Gestão de profissionais**: perfis, limites, horários.
5.**Dashboard**: visão simples de próximos agendamentos e receita prevista.
6.**Portal do cliente (booking)**: página web para marcação via link / subdomínio personalizado.
7.**Plano de assinaturas**: 3 níveis com limites por profissionais/filiais/uso financeiro.
8.**Financeiro básico**: registrar pagamentos manuais, status de transação (placeholder para integrações).
9.**White-label**: configuração básica de marca (logo, cores) e domínio personalizado.
10.**Notificações**: e-mail / webhook; WhatsApp via integração posterior (placeholder).
11.**Health-check & observability**: logs básicos + endpoint `/healthz`.
12.**Docs e OpenAPI**: contrato mínimo para endpoints principais.

 ##6. MLP / nice-to-have (post-MVP)
-Integração com gateways de pagamento (Stripe/PagSeguro), emissão de recibos, relatórios financeiros avançados, automações com IA, confirmações via WhatsApp e SMS, templates de e-mail.

 ##7. Regras de negócio principais
-Cada empresa tem um plano que define limites (nº profissionais, nº filiais, limite financeiro mensal).
-Agendamento: bloqueio de horário por serviço + buffer configurável.
-Profissionais podem ter múltiplos locais (filiais).
-Cancelamento: políticas configuráveis por empresa.

 ##8. KPIs iniciais (medir desde o início)
-MRR (Monthly Recurring Revenue)
-Nº de empresas onboarded (trials)
-Nº de agendamentos / dia
-Churn mensal
-Tempo médio até o primeiro agendamento pós-onboarding

 ##9. Riscos e premissas
 -Risco: muitas integrações externas podem atrasar MVP (PG, WhatsApp).
 -Premissa: começamos com automação financeira dentro do plano (sem gateway ao início — placeholders).

 ##10. Próximos passos (deliverables)
 -Entregar ERD inicial (ARCH-02)
 -Definir API OpenAPI (ARCH-03)
 -Scaffold do backend (CODE-01)
 -Pipeline CI (DEVOPS-01)

 ##11. Referências
 -Documentos do Sprint 0: `docs/`, `openapi.yaml` (quando criado)
