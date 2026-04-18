import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly searchInput: Locator;
  readonly filterChakra: Locator;
  readonly filterElement: Locator;
  readonly filterZodiac: Locator;
  readonly filterColor: Locator;
  readonly clearFilters: Locator;
  readonly crystalGrid: Locator;
  readonly crystalCards: Locator;
  readonly noResults: Locator;
  readonly resultsCount: Locator;
  readonly modal: Locator;
  readonly modalClose: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput   = page.getByTestId('search-input');
    this.filterChakra  = page.getByTestId('filter-chakra');
    this.filterElement = page.getByTestId('filter-element');
    this.filterZodiac  = page.getByTestId('filter-zodiac');
    this.filterColor   = page.getByTestId('filter-color');
    this.clearFilters  = page.getByTestId('clear-filters');
    this.crystalGrid   = page.getByTestId('crystal-grid');
    this.crystalCards  = page.getByTestId('crystal-card');
    this.noResults     = page.getByTestId('no-results');
    this.resultsCount  = page.getByTestId('results-count');
    this.modal         = page.getByTestId('crystal-modal');
    this.modalClose    = page.getByTestId('modal-close');
    this.pagination    = page.getByTestId('pagination');
  }

  async goto() {
    await this.page.goto('/');
    await this.crystalCards.first().waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async selectChakra(value: string) {
    await this.filterChakra.selectOption(value);
  }

  async selectElement(value: string) {
    await this.filterElement.selectOption(value);
  }

  async selectZodiac(value: string) {
    await this.filterZodiac.selectOption(value);
  }

  async selectColor(value: string) {
    await this.filterColor.selectOption(value);
  }

  async clickClearFilters() {
    await this.clearFilters.click();
  }

  async openFirstCard() {
    await this.crystalCards.first().click();
  }

  async getFirstCardName(): Promise<string> {
    return (await this.crystalCards.first().getByTestId('card-name').textContent()) ?? '';
  }
}
