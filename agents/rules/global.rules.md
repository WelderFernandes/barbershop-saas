# GLOBAL RULES — SAAS BARBEARIA

## STACK OBRIGATÓRIA

- Next.js App Router
- TypeScript STRICT
- Prisma ORM
- PostgreSQL ou SQLite no MVP
- Better Auth
- Stripe
- Tailwind CSS
- shadcn/ui
- Magic UI

## PILARES OBRIGATÓRIOS

- SaaS multi-tenant
- mobile-first
- responsividade real
- MVP orientado a venda
- segurança
- simplicidade
- escalabilidade progressiva

## PADRÕES

- todas as entidades principais devem respeitar tenant
- toda feature deve nascer mobile-first
- toda tela deve funcionar do celular ao desktop
- SSR sempre que possível
- componentes reutilizáveis
- código limpo e tipado
- UX simples e premium

## PROIBIDO

- overengineering
- desktop-first
- queries sem tenant
- UI sem responsividade
- tabelas quebradas em mobile
- abstrações desnecessárias
- lógica de negócio dentro da UI

## OBRIGATÓRIO

- isolamento seguro por tenant
- layout excelente no mobile
- experiência consistente em todos os breakpoints
- foco em tarefas principais do usuário
