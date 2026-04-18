import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

test.describe('Página Principal', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.goto();
  });

  test('título do documento contém "Guia dos Cristais"', async ({ page }) => {
    await expect(page).toHaveTitle(/Guia dos Cristais/);
  });

  test('heading principal é visível', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Guia dos Cristais');
  });

  test('subtítulo "Grimório dos Minerais" está visível', async ({ page }) => {
    await expect(page.getByText('Grimório dos Minerais').first()).toBeVisible();
  });

  test('link do rodapé aponta para LinkedIn de Sabrina Silva', async ({ page }) => {
    const footer = page.locator('footer a, a[href*="linkedin.com"]').first();
    await expect(footer).toBeVisible();
    await expect(footer).toHaveAttribute('href', /linkedin\.com/);
  });
});
