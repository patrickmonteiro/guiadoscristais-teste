# Guia dos Cristais — Testes E2E

Suite de testes end-to-end com [Playwright](https://playwright.dev/) para o site [Guia dos Cristais](https://guiadoscristais.netlify.app/).

## Pré-requisitos

- Node.js 18+
- [pnpm](https://pnpm.io/) — instale com `npm install -g pnpm`

## Instalação

```bash
pnpm install
pnpm exec playwright install --with-deps
```

## Executando os testes

```bash
# Suite completa nos 3 browsers (Chromium, Firefox, WebKit)
pnpm test

# Somente um browser
pnpm exec playwright test --project=chromium

# Um arquivo específico
pnpm exec playwright test tests/filters.spec.ts

# Um teste pelo nome
pnpm exec playwright test -g "filtro de Chakra"

# Modo UI interativo (ideal para desenvolvimento)
pnpm ui
```

## Relatório

Após cada execução o Playwright gera automaticamente um relatório HTML em `playwright-report/`. Para abri-lo:

```bash
pnpm exec playwright show-report
```

O relatório exibe status, duração, traces e screenshots de cada teste.

## Estrutura dos testes

| Arquivo | Cobertura |
|---|---|
| `tests/pages/home.page.ts` | Page Object Model (locators e actions reutilizáveis) |
| `tests/home.spec.ts` | Título, heading, subtítulo, link do rodapé |
| `tests/search.spec.ts` | Busca por texto, case-insensitive, estado vazio, contador |
| `tests/filters.spec.ts` | Filtros por Chakra, Elemento, Signo, Cor — individuais e combinados |
| `tests/crystal-grid.spec.ts` | Grid de cards, informações dos cards, paginação |
| `tests/crystal-modal.spec.ts` | Abertura, conteúdo completo e fechamento do modal |

## Implantação no GitHub Actions

O projeto já inclui o workflow em `.github/workflows/playwright.yml`. Ele é disparado automaticamente em todo push ou pull request para as branches `main`/`master`.

### O que o pipeline faz

1. Faz checkout do código
2. Configura Node.js LTS
3. Instala dependências com pnpm
4. Instala os browsers do Playwright com dependências do sistema
5. Executa todos os testes (108 testes × 3 browsers)
6. Publica o relatório HTML como artefato (retido por 30 dias)
7. **Publica o relatório no GitHub Pages** (apenas em pushes para `main`/`master`)

### Ativando o GitHub Pages

Para que o relatório seja publicado automaticamente no GitHub Pages, é necessário habilitar o recurso uma única vez no repositório:

1. Vá em **Settings** → **Pages** no seu repositório
2. Em **Source**, selecione **GitHub Actions**
3. Salve — nenhuma outra configuração é necessária

Após o próximo push para `main`, o relatório ficará disponível em:

```
https://<seu-usuario>.github.io/<nome-do-repositorio>/
```

> O Pages só é publicado em pushes diretos para `main`/`master`. Pull requests executam os testes mas não atualizam o Pages.

### Acessando o relatório no GitHub

- **GitHub Pages**: URL pública gerada automaticamente após cada push (conforme acima)
- **Artefato**: vá em **Actions** → clique na execução → seção **Artifacts** → baixe `playwright-report`

### Configurações de CI no `playwright.config.ts`

Quando a variável `CI` está presente (GitHub Actions a define automaticamente), o Playwright ajusta o comportamento:

```
workers: 1       # testes sequenciais para estabilidade
retries: 2       # até 2 tentativas por teste falho
```
