# Plano: Página de Agendamento Pública (Customer Scheduling)

Este plano descreve a implementação de uma interface pública onde clientes finais podem agendar serviços em uma barbearia específica através de seu subdomínio dedicado.

## User Review Required

> [!IMPORTANT]
> **Roteamento por Subdomínio**: Para que os subdomínios funcionem localmente (ex: `unidade1.localhost:3000`), você precisará configurar o seu arquivo `hosts` ou usar um serviço como `lvh.me`. Confirmaremos a lógica de extração do Host no Middleware.

## Mudanças Propostas

### 1. Infraestrutura e Roteamento

#### [MODIFY] [proxy.ts](file:///c:/Users/welde/Developer/barbershop-saas/proxy.ts)
- Atualizar o middleware para detectar o `host`.
- Se houver um subdomínio (ex: `unidade.barber.app`), reescrever internamente para `/book/unidade`.
- Ignorar a verificação de autenticação obrigatória para rotas que começam com `/book/`.

---

### 2. Interface Pública (Design Apple-Inspired)

#### [NEW] [app/(public)/book/[slug]/layout.tsx](file:///c:/Users/welde/Developer/barbershop-saas/app/(public)/book/[slug]/layout.tsx)
- Layout limpo, sem sidebar do dashboard.
- Focado em mobile, com container centralizado e tipografia Poppins.

#### [NEW] [app/(public)/book/[slug]/page.tsx](file:///c:/Users/welde/Developer/barbershop-saas/app/(public)/book/[slug]/page.tsx)
- Componente principal que gerencia o estado do fluxo de agendamento (Etapas).
- **Etapa 1**: Seleção de Serviço (Cards elegantes com preço e duração).
- **Etapa 2**: Seleção de Barbeiro (Avatares circulares, status de disponibilidade).
- **Etapa 3**: Seleção de Data e Horário (Calendário horizontal e grade de horários "pill-style").
- **Etapa 4**: Revisão e Identificação (Nome, Telefone e opção de Login social).

---

### 3. Lógica de Negócio e Dados

#### [NEW] [lib/actions/public-booking.ts](file:///c:/Users/welde/Developer/barbershop-saas/lib/actions/public-booking.ts)
- `getBarbershopData(slug)`: Busca serviços, barbeiros e horários da barbearia.
- `createPublicAppointment(data)`: Cria o agendamento no banco vinculado à organização correta.

#### [MODIFY] [prisma/schema.prisma](file:///c:/Users/welde/Developer/barbershop-saas/prisma/schema.prisma)
- (Opcional) Adicionar campo `email` ao agendamento se for necessário para envio de confirmação.

---

### 4. Estética e UX (Apple Style)

- **Cores**: Tons de cinza suaves, branco puro e preto profundo (Dark Mode nativo).
- **Componentes**: Botões com `rounded-full`, sombras `soft-xl`, e efeitos de `backdrop-blur`.
- **Transições**: Animações fluidas entre etapas.

## Perguntas Abertas

1. **Domínio Principal**: Qual será o domínio base para a produção? (Ex: `barber-saas.com`). Isso é importante para configurar a detecção de subdomínio.
2. **Confirmação**: Deseja que o cliente receba um resumo por WhatsApp ao finalizar? (Podemos preparar o link do WhatsApp Web/App com a mensagem pronta).
3. **Login Opcional**: Se o usuário optar por criar conta *durante* o agendamento, ele deve ser redirecionado para o dashboard após concluir?

## Plano de Verificação

### Testes Manuais
- Acessar `http://localhost:3000/book/unidade-teste` para validar o fluxo sem subdomínio primeiro.
- Simular acesso via subdominio configurando o cabeçalho `Host`.
- Validar criação de agendamento no banco de dados.
- Verificar isolamento de dados.
