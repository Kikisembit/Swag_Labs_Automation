const { test, expect } = require('../utils/fixtures');
const { label, description, severity } = require('allure-js-commons');
const { USERS } = require('../utils/credentials');
const { URLS, ERROR_MESSAGES, randomChars, randomPostalCode } = require('../utils/testData');

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addItemToCartByIndex(0);
    await inventoryPage.goToCart();
  });

  test('should complete checkout successfully and return to product page', async ({ page, cartPage, checkoutPage }) => {
    await label('feature', 'Checkout');
    await label('story', 'Checkout flow berhasil dengan data random');
    await description('Verifikasi bahwa user dapat menyelesaikan proses checkout, melihat konfirmasi "Thank you for your order!", dan kembali ke halaman produk.');
    await severity('critical');

    await cartPage.checkout();
    await expect(page).toHaveURL(URLS.checkoutStepOne);

    await checkoutPage.fillInfo(randomChars(), randomChars(), randomPostalCode());
    await checkoutPage.continue();
    await expect(page).toHaveURL(URLS.checkoutStepTwo);

    await checkoutPage.finish();
    await expect(page).toHaveURL(URLS.checkoutComplete);

    await expect(checkoutPage.completeHeader).toHaveText(ERROR_MESSAGES.orderComplete);

    await checkoutPage.backToHome();
    await expect(page).toHaveURL(URLS.inventory);
  });
});
