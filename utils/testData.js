const URLS = {
  inventory: 'https://www.saucedemo.com/inventory.html',
  cart: 'https://www.saucedemo.com/cart.html',
  checkoutStepOne: 'https://www.saucedemo.com/checkout-step-one.html',
  checkoutStepTwo: 'https://www.saucedemo.com/checkout-step-two.html',
  checkoutComplete: 'https://www.saucedemo.com/checkout-complete.html',
};

const ERROR_MESSAGES = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  usernameRequired: 'Username is required',
  passwordRequired: 'Password is required',
  wrongCredentials: 'Username and password do not match',
  orderComplete: 'Thank you for your order!',
};

function randomChars(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

function randomPostalCode() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

module.exports = { URLS, ERROR_MESSAGES, randomChars, randomPostalCode };
