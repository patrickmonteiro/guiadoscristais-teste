import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

test.describe('Busca por Texto', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.goto();
  });

  test('input de busca existe com placeholder correto', async () => {
    await expect(home.searchInput).toBeVisible();
    await expect(home.searchInput).toHaveAttribute('placeholder', '✦ Buscar cristal...');
  });

  test('buscar "Ametista" filtra e exibe o cristal correspondente', async () => {
    await home.search('Ametista');
    await expect(home.crystalCards).not.toHaveCount(0);
    const firstName = await home.crystalCards.first().getByTestId('card-name').textContent();
    expect(firstName?.toLowerCase()).toContain('ametista');
  });

  test('busca é case-insensitive', async () => {
    await home.search('ametista');
    await expect(home.crystalCards).not.toHaveCount(0);
  });

  test('busca por termo inexistente exibe estado vazio', async () => {
    await home.search('xyzcrystalnotexist123');
    await expect(home.noResults).toBeVisible();
    await expect(home.crystalCards).toHaveCount(0);
  });

  test('limpar busca restaura a primeira página com 9 cristais', async () => {
    await home.search('Ametista');
    await home.clearSearch();
    await expect(home.crystalCards).toHaveCount(9);
  });

  test('contador de resultados atualiza após busca', async () => {
    const initialCount = await home.resultsCount.textContent();
    await home.search('Ametista');
    const filteredCount = await home.resultsCount.textContent();
    expect(filteredCount).not.toEqual(initialCount);
  });
});
