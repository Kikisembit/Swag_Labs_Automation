const { test, expect } = require('../utils/fixtures');
const { label, description, severity } = require('allure-js-commons');
const { USERS } = require('../utils/credentials');
const { INVENTORY } = require('../utils/testData');

test.describe('Inventory Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('should display all products on inventory page', async ({ inventoryPage }) => {
    await label('feature', 'Inventory');
    await label('story', 'Menampilkan semua produk');
    await description('Verifikasi bahwa halaman inventory menampilkan semua produk beserta nama, harga, dan tombol "Add to cart".');
    await severity('critical');

    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.inventoryItems).toHaveCount(INVENTORY.totalProducts);

    for (const item of await inventoryPage.inventoryItems.all()) {
      await expect(item.locator('.inventory_item_name')).not.toBeEmpty();
      await expect(item.locator('.inventory_item_price')).toHaveText(/^\$\d+\.\d{2}$/);
      await expect(item.locator('button')).toHaveText('Add to cart');
    }
  });

  test('should sort products by name A to Z', async ({ inventoryPage }) => {
    await label('feature', 'Inventory');
    await label('story', 'Sort produk berdasarkan nama (A-Z)');
    await description('Verifikasi bahwa produk terurut alfabetis A-Z setelah memilih opsi sort "Name (A to Z)".');
    await severity('normal');

    // A-Z is the default order, so sort Z-A first to make sure the A-Z option really re-sorts
    await inventoryPage.sortBy('za');
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('should sort products by name Z to A', async ({ inventoryPage }) => {
    await label('feature', 'Inventory');
    await label('story', 'Sort produk berdasarkan nama (Z-A)');
    await description('Verifikasi bahwa produk terurut alfabetis Z-A setelah memilih opsi sort "Name (Z to A)".');
    await severity('normal');

    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('should sort products by price low to high', async ({ inventoryPage }) => {
    await label('feature', 'Inventory');
    await label('story', 'Sort produk berdasarkan harga (rendah ke tinggi)');
    await description('Verifikasi bahwa produk terurut dari harga termurah ke termahal setelah memilih opsi sort "Price (low to high)".');
    await severity('normal');

    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('should sort products by price high to low', async ({ inventoryPage }) => {
    await label('feature', 'Inventory');
    await label('story', 'Sort produk berdasarkan harga (tinggi ke rendah)');
    await description('Verifikasi bahwa produk terurut dari harga termahal ke termurah setelah memilih opsi sort "Price (high to low)".');
    await severity('normal');

    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('should update cart badge when adding and removing products', async ({ inventoryPage }) => {
    await label('feature', 'Inventory');
    await label('story', 'Tambah dan hapus produk dari halaman inventory');
    await description('Verifikasi bahwa badge cart bertambah saat produk ditambahkan dan berkurang/hilang saat produk dihapus dari halaman inventory.');
    await severity('critical');

    const [first, second] = await inventoryPage.getProductNames();

    await inventoryPage.addItemToCartByName(first);
    await inventoryPage.addItemToCartByName(second);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeItemFromCartByName(first);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeItemFromCartByName(second);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
