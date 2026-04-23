const { test, expect } = require('../utils/fixtures');
const { label, description, severity } = require('allure-js-commons');
const { USERS } = require('../utils/credentials');
const { URLS, ERROR_MESSAGES } = require('../utils/testData');

test.describe('Login Tests', () => {
  test('should login successfully with standard_user', async ({ page, loginPage }) => {
    await label('feature', 'Login');
    await label('story', 'Login dengan kredensial valid');
    await description('Verifikasi bahwa user standard_user berhasil login dan diarahkan ke halaman inventory.');
    await severity('critical');

    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(URLS.inventory);
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.inventory_item_name').first()).toBeVisible();
    await expect(page.locator('button.btn_primary.btn_inventory').first()).toHaveText('Add to cart');
  });

  test('should show error for locked_out_user', async ({ loginPage }) => {
    await label('feature', 'Login');
    await label('story', 'Login dengan akun yang dikunci');
    await description('Verifikasi bahwa user locked_out_user mendapat pesan error bahwa akunnya dikunci.');
    await severity('normal');

    await loginPage.login(USERS.locked_out.username, USERS.locked_out.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toBe(ERROR_MESSAGES.lockedOut);
  });

  test('should show broken product images for problem_user', async ({ page, loginPage }) => {
    await label('feature', 'Login');
    await label('story', 'Login dengan problem_user menampilkan gambar produk yang salah');
    await description('Verifikasi bahwa problem_user berhasil login namun semua gambar produk menampilkan gambar yang sama/salah.');
    await severity('normal');

    await loginPage.login(USERS.problem.username, USERS.problem.password);
    await expect(page).toHaveURL(URLS.inventory);

    const images = page.locator('.inventory_item img');
    const count = await images.count();
    const srcs = [];
    for (let i = 0; i < count; i++) {
      srcs.push(await images.nth(i).getAttribute('src'));
    }

    const allSame = srcs.every(src => src === srcs[0]);
    expect(allSame).toBe(true);
  });

  test('should login slowly for performance_glitch_user', async ({ page, loginPage }) => {
    await label('feature', 'Login');
    await label('story', 'Login dengan performance_glitch_user membutuhkan waktu lebih lama');
    await description('Verifikasi bahwa performance_glitch_user berhasil login namun redirect ke halaman inventory membutuhkan waktu lebih lama dari biasanya.');
    await severity('normal');

    const start = Date.now();
    await loginPage.login(USERS.performance_glitch.username, USERS.performance_glitch.password);
    await expect(page).toHaveURL(URLS.inventory, { timeout: 10000 });
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThan(1000);
  });

  test('should show error when error_user adds item to cart', async ({ page, loginPage }) => {
    await label('feature', 'Login');
    await label('story', 'Login dengan error_user memunculkan error saat interaksi');
    await description('Verifikasi bahwa error_user berhasil login namun mendapat error saat mencoba menambahkan produk ke cart.');
    await severity('normal');

    await loginPage.login(USERS.error.username, USERS.error.password);
    await expect(page).toHaveURL(URLS.inventory);

    await page.locator('button.btn_primary.btn_inventory').first().click();
    await expect(page.locator('button.btn_secondary.btn_inventory').first()).toBeVisible();

    await page.locator('button.btn_secondary.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('should not overlap cart icon and filter icon for visual_user', async ({ page, loginPage }) => {
    await label('feature', 'Login');
    await label('story', 'Login dengan visual_user menampilkan visual issue pada icon cart');
    await description('Verifikasi bahwa visual_user mengalami visual bug dimana icon cart dan filter saling overlap/berdekatan secara tidak wajar.');
    await severity('normal');

    await loginPage.login(USERS.visual.username, USERS.visual.password);
    await expect(page).toHaveURL(URLS.inventory);

    const cartBox = await page.locator('.shopping_cart_link').boundingBox();
    const filterBox = await page.locator('.product_sort_container').boundingBox();

    const cartRight = cartBox.x + cartBox.width;
    const filterLeft = filterBox.x;

    expect(cartRight).toBeLessThan(filterLeft);
  });
});
