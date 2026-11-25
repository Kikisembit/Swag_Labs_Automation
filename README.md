# Swag Labs Automation

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
├── tests/                  # Test spec files
│   ├── login.spec.js       # Login scenarios (6 test cases)
│   ├── cart.spec.js        # Add to cart flow
│   └── checkout.spec.js    # Checkout flow
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
| TC6 | Visual overlap bug | `visual_user` | Cart icon overlaps filter icon (known bug) |

### Cart (`cart.spec.js`)
| # | Test | Expected |
|---|------|----------|
| TC1 | Add product to cart | Product appears in cart with correct name and quantity 1 |

### Checkout (`checkout.spec.js`)
| # | Test | Expected |
|---|------|----------|
| TC1 | Complete checkout | Order confirmed with "Thank you for your order!" message |
