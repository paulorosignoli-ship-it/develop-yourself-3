# RH na Mesa do CEO — DevelopYourself

MVP de diagnóstico interativo de maturidade estratégica do RH, com cálculo de
score, geração de relatório em PDF e captura de leads opcionalmente
persistida no Supabase.

## Stack
- Next.js 16 (App Router) + TypeScript
- React 19
- Lucide React (ícones)
- CSS puro (sem framework visual)
- `@supabase/supabase-js` — persistência de leads/resultados (opcional)
- `@react-pdf/renderer` — geração do relatório em PDF, 100% server-side

## Rodar localmente
```bash
npm install
npm run dev
```
Depois abra http://localhost:3000

## O que foi corrigido nesta revisão
- Removido um espaço em branco antes de `"use client"` em
  `app/diagnostico/page.tsx` (fora do padrão esperado pelo compilador).
- As imagens em `public/images` eram arquivos de 0 bytes — qualquer página
  que as carregasse via `next/image` falhava ao otimizar a imagem em
  produção. Foram substituídas por placeholders reais (gradiente na paleta
  da marca) até as fotos definitivas serem enviadas.
- Versões de `next`/`react`/`react-dom` fixadas em combinações testadas
  (16.2.3 / 19.2.0) em vez de ranges `^` que podiam puxar uma versão ainda
  não compatível.
- Adicionado `eslint` + `eslint-config-next` (o projeto não tinha nenhuma
  configuração de lint).
- A lógica de pontuação (que antes só existia dentro do componente da
  página) foi extraída para `lib/scoring.ts`, reaproveitada tanto no
  cliente quanto nas rotas de API — evita divergência entre o que a tela
  mostra e o que vai para o banco/PDF.

## Variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha o que for usar:

```bash
cp .env.example .env.local
```

| Variável | Obrigatória? | Descrição |
|---|---|---|
| `SUPABASE_URL` | Não | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Não | Service role key (nunca a `anon`) |
| `NEXT_PUBLIC_GA_ID` | Não | Google Analytics |
| `NEXT_PUBLIC_META_PIXEL_ID` | Não | Meta Pixel |

**O app funciona 100% sem Supabase configurado.** Sem essas variáveis, o
diagnóstico calcula e mostra o resultado, e o PDF continua funcionando
normalmente — só não fica nada salvo em banco.

## Configurar o Supabase (opcional, para guardar os leads)
1. Crie um projeto em https://supabase.com.
2. No SQL Editor do projeto, rode o conteúdo de `supabase/schema.sql`.
3. Em Project Settings → API, copie a **Project URL** e a **service_role
   key** (não a `anon public`).
4. No Vercel, adicione `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` em
   Project Settings → Environment Variables.

A tabela `diagnostic_results` guarda nome, e-mail, cargo, empresa, respostas
brutas e os scores já calculados — é a base para o "Estado do RH Estratégico
no Brasil" mencionado na especificação do produto (seção 20).
A service role key só é usada em Route Handlers (servidor), nunca chega ao
navegador, e o RLS da tabela fica travado por padrão.

## Relatório em PDF
Na tela de resultado, o botão "Baixar relatório em PDF" chama
`POST /api/leads/pdf`, que renderiza o PDF inteiramente no servidor com
`@react-pdf/renderer` (sem headless browser, funciona em qualquer runtime
Node da Vercel) e devolve o arquivo como download. Funciona com ou sem
Supabase configurado.

## Rotas de API
- `POST /api/leads` — recebe `{ name, email, role, company, size, answers }`,
  calcula o score no servidor (fonte da verdade) e, se o Supabase estiver
  configurado, insere a linha. Sempre devolve o resultado calculado, mesmo
  se a gravação falhar.
- `POST /api/leads/pdf` — recebe o `id` (se houver) ou os dados do
  resultado e devolve o PDF (`application/pdf`).

## Deploy na Vercel
1. Suba este repositório para o GitHub.
2. Importe o repositório em vercel.com/new — é detectado automaticamente
   como Next.js, não precisa mudar nenhuma configuração de build.
3. Adicione as variáveis de ambiente do Supabase (se for usar) antes do
   primeiro deploy, em Project Settings → Environment Variables.
4. Se o build falhar, copie a mensagem de erro completa do log da Vercel —
   ela aponta exatamente o arquivo e a linha, o que é muito mais rápido de
   resolver do que tentar adivinhar.

## Imagens
As imagens ficam em `public/images`. Veja `public/images/README.md` — os
arquivos atuais são placeholders gerados (gradiente navy/gold), você pode
substituir pelos arquivos reais sem alterar nenhum código, só manter o
mesmo nome de arquivo.

## Lead capture
O formulário envia para `/api/leads`. Se quiser também empurrar o lead para
um CRM/ferramenta de e-mail (MailerLite, HubSpot etc.), o lugar mais simples
é dentro de `app/api/leads/route.ts`, logo após o insert no Supabase.

## Importante
Esta é uma ferramenta de autoavaliação, não um teste psicométrico validado
cientificamente nem um benchmark organizacional. Os resultados são
indicativos e destinados a provocar reflexão e ação.
