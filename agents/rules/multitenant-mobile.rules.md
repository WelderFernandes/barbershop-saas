# MULTI-TENANT + MOBILE-FIRST RULES

## MISSÃO

Todo o sistema deve ser pensado como um SaaS multi-tenant, com experiência excelente em dispositivos móveis e responsividade real em todos os módulos.

---

## MULTI-TENANT OBRIGATÓRIO

### DEFINIÇÃO

O sistema deve suportar múltiplas barbearias, com total isolamento de dados, regras e contexto operacional por tenant.

### REGRA PRINCIPAL

Nenhum dado de um tenant pode ser acessado por outro tenant.

### OBRIGATÓRIO

- Todas as entidades principais devem ter `tenantId` ou `barbershopId`
- Toda query deve filtrar pelo tenant atual
- Toda action/server action/route deve validar contexto do tenant
- Toda autenticação deve carregar tenant context
- O sistema deve estar preparado para:
  - uma barbearia por tenant
  - múltiplos usuários por tenant
  - múltiplos barbeiros por tenant
  - evolução futura para múltiplas unidades

### PADRÃO DE CONTEXTO

O tenant deve ser resolvido por:

- sessão do usuário
- relação do usuário com a barbearia
- contexto ativo no app

### PROIBIDO

- buscar dados sem filtro de tenant
- confiar apenas em filtros do frontend
- usar dados globais sem justificativa
- modelar recursos centrais sem vínculo com tenant

### MULTI-TENANT MVP

No MVP, usar multi-tenant simples e seguro:

- `barbershopId` como escopo principal
- isolamento por banco lógico via colunas
- sem arquitetura distribuída complexa
- sem microserviços desnecessários

### PREPARAÇÃO PARA ESCALA

A arquitetura deve ser simples agora, mas preparada para:

- múltiplas unidades por tenant
- permissões por equipe
- planos por tenant
- billing por tenant
- recursos por tenant
- branding por tenant

---

## MOBILE-FIRST OBRIGATÓRIO

### DEFINIÇÃO

Toda interface deve ser projetada primeiro para celular e depois adaptada para tablet e desktop.

### REGRA PRINCIPAL

A experiência mobile não pode ser uma adaptação ruim da versão desktop.
Ela deve ser uma experiência nativa, clara, rápida e funcional.

### OBRIGATÓRIO

- começar layout pelo viewport mobile
- ações principais visíveis sem esforço
- navegação simples com baixa fricção
- formulários curtos e bem organizados
- componentes pensados para toque
- áreas clicáveis confortáveis
- tipografia legível em telas pequenas
- espaçamento consistente
- drawers, sheets e bottom actions quando fizer sentido
- tabelas devem ter versões responsivas
- calendários e agendas devem funcionar bem no celular

### PRIORIZAR NO MOBILE

- agenda do dia
- criar agendamento
- confirmar presença
- consultar clientes
- visualizar próximos horários
- acompanhar faturamento resumido
- acessar perfil do barbeiro
- atualizar status operacional rapidamente

### PROIBIDO

- desktop-first
- tabelas quebradas no celular
- modais impossíveis de usar em telas pequenas
- botões pequenos demais
- excesso de colunas
- excesso de texto por bloco
- menus complexos no mobile
- depender de hover para ações importantes

---

## RESPONSIVIDADE OBRIGATÓRIA

### DEFINIÇÃO

Responsividade não é apenas “encolher layout”.
É reorganizar a experiência conforme a tela e o contexto de uso.

### REGRAS

- em mobile: foco, ação rápida e prioridade visual
- em tablet: equilíbrio entre densidade e clareza
- em desktop: aproveitar espaço sem poluir
- componentes devem se adaptar por breakpoint
- grids devem reorganizar conteúdo com elegância
- cards, tabelas, filtros e formulários devem ter versões adaptadas

### PADRÕES DE INTERFACE

- cards empilhados no mobile
- grids de 1 coluna no mobile, expandindo progressivamente
- tabelas com fallback para cards/listas
- sidebar recolhível ou drawer no mobile
- filtros em drawer/sheet no mobile
- ações principais fixas quando necessário
- CTAs sempre visíveis
- cabeçalhos compactos em telas pequenas

### EXPERIÊNCIA IDEAL

Cada tela deve responder:

1. Qual a ação principal no celular?
2. O usuário consegue executar isso com uma mão?
3. O conteúdo continua legível?
4. A interface continua premium?
5. Existe alguma fricção desnecessária?

---

## PERFORMANCE DE UX

- evitar componentes pesados sem necessidade
- reduzir densidade visual no mobile
- usar skeletons e estados vazios elegantes
- manter tempos perceptivos baixos
- preferir interações simples e rápidas

---

## MODO OBRIGATÓRIO PARA TODOS OS AGENTS

Antes de propor qualquer solução, validar:

- isso respeita multi-tenant?
- isso isola corretamente os dados?
- isso funciona muito bem no celular?
- isso é realmente responsivo?
- isso continua simples no MVP?
