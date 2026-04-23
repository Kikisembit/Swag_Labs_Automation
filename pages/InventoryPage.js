class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async getTitle() {
    return await this.title.textContent();
  }

  async getItemCount() {
    return await this.inventoryItems.count();
  }

  async addItemToCartByIndex(index = 0) {
    const addButton = this.inventoryItems.nth(index).locator('button');
    await addButton.click();
  }

  async addItemToCartByName(name) {
    const item = this.page.locator('.inventory_item').filter({ hasText: name });
    await item.locator('button').click();
  }

  async sortBy(option) {
    // options: 'az', 'za', 'lohi', 'hilo'
    await this.sortDropdown.selectOption(option);
  }

  async getCartCount() {
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.textContent());
    }
    return 0;
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }
}

module.exports = { InventoryPage };
