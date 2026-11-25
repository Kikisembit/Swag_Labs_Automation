# Swag Labs Automation

[![Playwright Tests](https://github.com/Kikisembit/Swag_Labs_Automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/Kikisembit/Swag_Labs_Automation/actions/workflows/playwright.yml)

UI test automation for [Swag Labs (SauceDemo)](https://www.saucedemo.com) built with Playwright and Allure Report.

---

## Framework & Tools

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | Browser automation & test runner |
| [Allure Playwright](https://allurereport.org) | Test reporting |
| [allure-js-commons](https://github.com/allure-framework/allure-js) | Allure labels & annotations |
| Node.js | Runtime environment |
| Java | Required by Allure CLI to generate reports |

---

## Prerequisites

- **Node.js** v18 or higher
- **Java** v8 or higher (required for Allure report)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kikisembit/Swag_Labs_Automation.git
   cd Swag_Labs_Automation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

4. Create a `.env` file from the template and fill in the SauceDemo credentials (listed on the [login page](https://www.saucedemo.com)):
   ```bash
   cp .env.example .env
   ```

---

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npm run test:login
npm run test:inventory
npm run test:cart
npm run test:checkout
```

### Run with visible browser (headed mode)
```bash
npm run test:headed
```

### Run with Playwright UI mode
```bash
npm run test:ui
```

---

## Continuous Integration

Tests run automatically on GitHub Actions ([`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)) on every push and pull request to `main`, and can also be started manually from the **Actions** tab.

- Runs headless Chromium on `ubuntu-latest` (2 retries on CI)
- Uploads the **Playwright HTML report** and **Allure results** as build artifacts

Credentials are read from repository secrets. Add these under **Settings → Secrets and variables → Actions**:

`STANDARD_USER`, `LOCKED_OUT_USER`, `PROBLEM_USER`, `PERFORMANCE_GLITCH_USER`, `ERROR_USER`, `VISUAL_USER`, `PASSWORD`

---

## Allure Report

Generate and view the Allure report after running tests:

```bash
# Serve report directly (recommended)
npm run allure:serve

# Or: generate then open
npm run allure:generate
npm run allure:open
```

> Make sure Java is installed before running Allure commands.

---

## Project Structure

```
Swag_Labs_Automation/
├── pages/                  # Page Object Model classes
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
│
├── .github/workflows/      # CI pipeline (GitHub Actions)
│   └── playwright.yml
│
├── tests/                  # Test spec files
│   ├── login.spec.js       # Login scenarios per user type
│   ├── inventory.spec.js   # Product listing, sorting, add/remove
│   ├── cart.spec.js        # Cart add, remove, continue shopping
│   └── checkout.spec.js    # Checkout flow, form validation, cancel
│
├── utils/                  # Shared utilities
│   ├── credentials.js      # Test user credentials
│   ├── fixtures.js         # Playwright custom fixtures (page objects)
│   └── testData.js         # URLs, error messages, random data helpers
│
├── allure-results/         # Raw Allure result files (auto-generated)
├── playwright-report/      # Playwright HTML report (auto-generated)
├── playwright.config.js    # Playwright configuration
└── package.json
```

### Key design decisions

- **Page Object Model (POM)** — all page interactions are encapsulated in `pages/`, keeping test logic separate from UI interactions.
- **Shared Fixtures** — `utils/fixtures.js` extends Playwright's built-in fixtures to provide ready-to-use page objects, eliminating boilerplate in every spec.
- **Centralized Test Data** — `utils/testData.js` stores all URLs, expected error messages, and random data generators. No hardcoded values in test files.
- **Allure Annotations** — every test is tagged with `feature`, `story`, `description`, and `severity` for rich reporting.

---

## Test Cases

### Login (`login.spec.js`)
| # | Test | User | Expected |
|---|------|------|----------|
| TC1 | Successful login | `standard_user` | Redirect to inventory, products visible |
| TC2 | Locked out user | `locked_out_user` | Error message shown |
| TC3 | Broken product images | `problem_user` | All product images are the same (bug) |
| TC4 | Slow login | `performance_glitch_user` | Login takes > 1 second |
| TC5 | Remove from cart fails | `error_user` | Item stays in cart after remove |
| TC6 | Visual overlap bug | `visual_user` | Cart icon overlaps sort dropdown (known bug) |

### Inventory (`inventory.spec.js`)
| # | Test | Expected |
|---|------|----------|
| TC1 | Display all products | 6 products shown, each with name, price, and "Add to cart" button |
| TC2 | Sort by name A to Z | Products in ascending alphabetical order |
| TC3 | Sort by name Z to A | Products in descending alphabetical order |
| TC4 | Sort by price low to high | Prices in ascending order |
| TC5 | Sort by price high to low | Prices in descending order |
| TC6 | Add & remove from inventory | Cart badge goes 2 → 1 → hidden |

### Cart (`cart.spec.js`)
| # | Test | Expected |
|---|------|----------|
| TC1 | Add product to cart | Product appears in cart with correct name and quantity 1 |
| TC2 | Remove product from cart | Removed item disappears, other item stays, badge updates |
| TC3 | Continue shopping | Back to inventory, cart contents kept |

### Checkout (`checkout.spec.js`)
| # | Test | Expected |
|---|------|----------|
| TC1 | Complete checkout | Order confirmed with "Thank you for your order!" message |
| TC2 | All fields empty | "Error: First Name is required" |
| TC3 | First name empty | "Error: First Name is required" |
| TC4 | Last name empty | "Error: Last Name is required" |
| TC5 | Postal code empty | "Error: Postal Code is required" |
| TC6 | Cancel checkout | Back to cart, item still in cart |
