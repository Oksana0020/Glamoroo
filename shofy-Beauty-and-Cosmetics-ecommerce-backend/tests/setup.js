require('dotenv').config();

process.env.NODE_ENV = 'test';
process.env.STRIPE_KEY = 'sk_test_fake_key_for_testing';
process.env.PAYPAL_CLIENT_ID = 'test_paypal_client_id';
process.env.PAYPAL_CLIENT_SECRET = 'test_paypal_client_secret';
process.env.PAYPAL_MODE = 'sandbox';
process.env.STORE_URL = 'http://localhost:3000';
process.env.ADMIN_URL = 'http://localhost:4000';

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};