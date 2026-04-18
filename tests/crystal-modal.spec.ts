import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

test.describe('Modal de Detalhe do Cristal', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.goto();
  });

  test('clicar em um card abre o modal', async () => {
    await home.openFirstCard();
    await expect(home.modal).toHaveAttribute('open');
  });

  test('modal exibe o nome do cristal', async () => {
    await home.openFirstCard();
    const modalName = home.modal.getByTestId('modal-name');
    await expect(modalName).toBeVisible();
    await expect(modalName).not.toBeEmpty();
  });

  test('modal exibe a cor do cristal', async () => {
    await home.openFirstCard();
    await expect(home.modal.getByTestId('modal-color')).toBeVisible();
  });

  test('modal exibe a dureza em Mohs', async () => {
    await home.openFirstCard();
    const hardness = home.modal.getByTestId('modal-hardness');
    await expect(hardness).toBeVisible();
    await expect(hardness).toContainText('Mohs');
  });

  test('modal exibe chakras, elementos, signos e palavras-chave', async () => {
    await home.openFirstCard();
    await expect(home.modal.getByTestId('modal-chakras')).not.toBeEmpty();
    await expect(home.modal.getByTestId('modal-elements')).not.toBeEmpty();
    await expect(home.modal.getByTestId('modal-zodiac')).not.toBeEmpty();
    await expect(home.modal.getByTestId('modal-keywords')).not.toBeEmpty();
  });

  test('fechar pelo botão "✕" fecha o modal', async () => {
    await home.openFirstCard();
    await expect(home.modal).toHaveAttribute('open');
    await home.modalClose.click();
    await expect(home.modal).not.toHaveAttribute('open');
  });

  test('nome do card clicado corresponde ao nome exibido no modal', async () => {
    const cardName = await home.getFirstCardName();
    await home.openFirstCard();
    const modalName = await home.modal.getByTestId('modal-name').textContent();
    expect(modalName?.trim()).toBe(cardName.trim());
  });

  test('fechar clicando no backdrop fecha o modal', async ({ page }) => {
    await home.openFirstCard();
    await expect(home.modal).toHaveAttribute('open');

    // Clica no backdrop (fora do modal-box, dentro do dialog)
    await page.mouse.click(10, 10);
    await expect(home.modal).not.toHaveAttribute('open');
  });
});
