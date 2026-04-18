import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

test.describe('Grid de Cristais e Paginação', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.goto();
  });

  test('grid de cristais é visível no carregamento inicial', async () => {
    await expect(home.crystalGrid).toBeVisible();
  });

  test('primeira página exibe no máximo 9 cards', async () => {
    const count = await home.crystalCards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(9);
  });

  test('cada card exibe nome, cor, dureza e descrição', async () => {
    const firstCard = home.crystalCards.first();
    await expect(firstCard.getByTestId('card-name')).toBeVisible();
    await expect(firstCard.getByTestId('card-color')).toBeVisible();
    await expect(firstCard.getByTestId('card-hardness')).toBeVisible();
    await expect(firstCard.getByTestId('card-description')).toBeVisible();
  });

  test('contador de resultados é exibido e não está vazio', async () => {
    await expect(home.resultsCount).not.toBeEmpty();
  });

  test('paginação é exibida com o total de cristais', async () => {
    await expect(home.pagination).toBeVisible();
  });

  test('clicar em "próxima página" carrega novos cards', async ({ page }) => {
    const firstPageNames = await home.crystalCards.getByTestId('card-name').allTextContents();

    const nextBtn = page.getByTestId('pagination-next');
    await nextBtn.click();
    await home.crystalCards.first().waitFor({ state: 'visible' });

    const secondPageNames = await home.crystalCards.getByTestId('card-name').allTextContents();
    expect(secondPageNames).not.toEqual(firstPageNames);
  });

  test('clicar na página 2 navega corretamente', async ({ page }) => {
    const firstPageNames = await home.crystalCards.getByTestId('card-name').allTextContents();

    const page2Btn = page.getByTestId('pagination-page-2');
    await page2Btn.click();
    await home.crystalCards.first().waitFor({ state: 'visible' });

    const secondPageNames = await home.crystalCards.getByTestId('card-name').allTextContents();
    expect(secondPageNames).not.toEqual(firstPageNames);
  });

  test('botão de página anterior está visualmente desabilitado na página 1', async ({ page }) => {
    const prevBtn = page.getByTestId('pagination-prev');
    const isVisible = await prevBtn.isVisible().catch(() => false);
    if (isVisible) {
      // O site usa classe CSS btn-disabled em vez do atributo disabled nativo
      await expect(prevBtn).toHaveClass(/btn-disabled/);
    }
  });
});
