const { test, expect } = require('../utils/fixtures');
const { label, description, severity } = require('allure-js-commons');
const { USERS } = require('../utils/credentials');
const { URLS } = require('../utils/testData');

test.describe('Cart Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('should add product to cart and verify it appears in cart', async ({ page, inventoryPage, cartPage }) => {
    await label('feature', 'Cart');
    await label('story', 'Tambah produk ke cart dan verifikasi di halaman cart');
    await description('Verifikasi bahwa produk yang dipilih berhasil ditambahkan ke cart dengan quantity 1 dan nama produk sesuai.');
    await severity('critical');

    const productName = await inventoryPage.inventoryItems.first().locator('.inventory_item_name').textContent();

    await inventoryPage.addItemToCartByIndex(0);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(URLS.cart);

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems.first().locator('.cart_quantity')).toHaveText('1');
    await expect(cartPage.cartItems.first().locator('.inventory_item_name')).toHaveText(productName);
  });

  test('should remove product from cart', async ({ page, inventoryPage, cartPage }) => {
    await label('feature', 'Cart');
    await label('story', 'Hapus produk dari halaman cart');
    await description('Verifikasi bahwa produk yang dihapus dari halaman cart hilang dari daftar, sementara produk lain tetap ada, dan badge cart ter-update.');
    await severity('critical');

    const [first, second] = await inventoryPage.getProductNames();
    await inventoryPage.addItemToCartByName(first);
    await inventoryPage.addItemToCartByName(second);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(URLS.cart);
    await expect(cartPage.cartItems).toHaveCount(2);

    await cartPage.removeItemByName(first);
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems.first().locator('.inventory_item_name')).toHaveText(second);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await cartPage.removeItemByName(second);
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('should keep cart items after continue shopping', async ({ page, inventoryPage, cartPage }) => {
    await label('feature', 'Cart');
    await label('story', 'Kembali belanja dari halaman cart');
    await description('Verifikasi bahwa tombol "Continue Shopping" kembali ke halaman inventory dan isi cart tetap tersimpan.');
    await severity('normal');

    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(URLS.inventory);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.inventoryItems.first().locator('button')).toHaveText('Remove');
  });
});
