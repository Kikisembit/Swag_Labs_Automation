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

  test.describe('Checkout form validation', () => {
    const cases = [
      { name: 'all fields are empty', firstName: '', lastName: '', postalCode: '', error: 'firstNameRequired' },
      { name: 'first name is empty', firstName: '', lastName: 'Doe', postalCode: '12345', error: 'firstNameRequired' },
      { name: 'last name is empty', firstName: 'John', lastName: '', postalCode: '12345', error: 'lastNameRequired' },
      { name: 'postal code is empty', firstName: 'John', lastName: 'Doe', postalCode: '', error: 'postalCodeRequired' },
    ];

    for (const { name, firstName, lastName, postalCode, error } of cases) {
      test(`should show error when ${name}`, async ({ page, cartPage, checkoutPage }) => {
        await label('feature', 'Checkout');
        await label('story', 'Validasi form checkout');
        await description(`Verifikasi bahwa user tidak bisa lanjut ke step 2 checkout dan mendapat pesan error saat ${name}.`);
        await severity('normal');

        await cartPage.checkout();
        await checkoutPage.fillInfo(firstName, lastName, postalCode);
        await checkoutPage.continue();

        await expect(checkoutPage.errorMessage).toHaveText(ERROR_MESSAGES[error]);
        await expect(page).toHaveURL(URLS.checkoutStepOne);
      });
    }
  });

  test('should return to cart when checkout is cancelled', async ({ page, cartPage, checkoutPage }) => {
    await label('feature', 'Checkout');
    await label('story', 'Batalkan checkout');
    await description('Verifikasi bahwa tombol "Cancel" di step 1 checkout kembali ke halaman cart dan isi cart tetap ada.');
    await severity('minor');

    await cartPage.checkout();
    await checkoutPage.cancel();

    await expect(page).toHaveURL(URLS.cart);
    await expect(cartPage.cartItems).toHaveCount(1);
  });
});
