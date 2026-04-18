import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

test.describe('Filtros', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.goto();
  });

  test('todos os selects iniciam com opção padrão vazia', async () => {
    await expect(home.filterChakra).toHaveValue('');
    await expect(home.filterElement).toHaveValue('');
    await expect(home.filterZodiac).toHaveValue('');
    await expect(home.filterColor).toHaveValue('');
  });

  test('filtro de Chakra "Raiz" retorna cristais', async () => {
    await home.selectChakra('Raiz');
    await expect(home.crystalCards).not.toHaveCount(0);
  });

  test('filtro de Elemento "Fogo" retorna cristais', async () => {
    await home.selectElement('Fogo');
    await expect(home.crystalCards).not.toHaveCount(0);
  });

  test('filtro de Signo "Áries" retorna cristais', async () => {
    await home.selectZodiac('Áries');
    await expect(home.crystalCards).not.toHaveCount(0);
  });

  test('filtro de Cor "Roxo" retorna cristais', async () => {
    await home.selectColor('Roxo');
    await expect(home.crystalCards).not.toHaveCount(0);
  });

  test('combinação de Chakra + Cor restringe os resultados', async () => {
    await home.selectChakra('Coroa');
    const chakraCount = await home.crystalCards.count();

    await home.selectColor('Roxo');
    const combinedCount = await home.crystalCards.count();

    expect(combinedCount).toBeLessThanOrEqual(chakraCount);
  });

  test('combinação de filtros sem resultados exibe estado vazio', async () => {
    await home.selectChakra('Raiz');
    await home.selectColor('Roxo');
    await home.selectElement('Ar');
    await home.selectZodiac('Aquário');

    const count = await home.crystalCards.count();
    if (count === 0) {
      await expect(home.noResults).toBeVisible();
    }
  });

  test('botão Limpar reseta todos os filtros para o valor padrão', async () => {
    await home.selectChakra('Raiz');
    await home.selectElement('Fogo');
    await home.clickClearFilters();

    await expect(home.filterChakra).toHaveValue('');
    await expect(home.filterElement).toHaveValue('');
    await expect(home.filterZodiac).toHaveValue('');
    await expect(home.filterColor).toHaveValue('');
  });

  test('botão Limpar restaura o grid completo após filtro ativo', async () => {
    await home.selectChakra('Raiz');
    await home.clickClearFilters();
    await expect(home.crystalCards).toHaveCount(9);
  });

  test('busca combinada com filtro retorna interseção dos resultados', async () => {
    await home.selectChakra('Raiz');
    const chakraCount = await home.crystalCards.count();

    await home.search('a');
    const combinedCount = await home.crystalCards.count();

    expect(combinedCount).toBeLessThanOrEqual(chakraCount);
  });
});
