class CartPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getTitle() {
    return await this.title.textContent();
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async removeItemByName(name) {
    const item = this.cartItems.filter({ hasText: name });
    await item.locator('button').click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

module.exports = { CartPage };
