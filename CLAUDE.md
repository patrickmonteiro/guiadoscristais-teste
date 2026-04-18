# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests (Chromium, Firefox, WebKit)
pnpm test

# Run tests with interactive UI
pnpm ui

# Run a single test file
pnpm exec playwright test tests/filters.spec.ts

# Run tests in a specific browser only
pnpm exec playwright test --project=chromium

# Run a single test by name
pnpm exec playwright test -g "filtro de Chakra"

# Show last HTML report
pnpm exec playwright show-report
```

## Architecture

This is a Playwright end-to-end test suite targeting the live site at `https://guiadoscristais.netlify.app/`. The `baseURL` is set in `playwright.config.ts`, so all `page.goto('/')` calls resolve to that URL.

### Test structure

```
tests/
├── pages/
│   └── home.page.ts       ← Page Object Model (locators + actions)
├── home.spec.ts           ← título, heading, subtítulo, rodapé
├── search.spec.ts         ← busca por texto (placeholder, case, vazio, limpar)
├── filters.spec.ts        ← filtros individuais, combinados, limpar
├── crystal-grid.spec.ts   ← grid de cards, contador, paginação
└── crystal-modal.spec.ts  ← abertura, conteúdo, fechamento do modal
```

All specs import `HomePage` from `tests/pages/home.page.ts` — add new locators and actions there before adding them to tests.

- Tests run against three browsers in parallel: Chromium, Firefox, and WebKit (108 tests total).
- On CI (`process.env.CI`), parallelism is disabled and retries are set to 2; locally, tests run fully parallel with no retries.
- The HTML reporter writes output to `playwright-report/`; failed test traces and artifacts go to `test-results/`.
- There is no local dev server — tests always hit the deployed Netlify URL directly.
- The package manager is `pnpm` (v10.12.3); use `pnpm` for all install/run commands.
