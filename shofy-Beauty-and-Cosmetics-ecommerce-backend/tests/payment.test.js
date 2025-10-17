const { processPayment } = require('../services/payment.service');
const { createPayPalOrder } = require('../services/paypal.service');

jest.mock('stripe', () => {
  return jest.fn(() => ({
    paymentIntents: {
      create: jest.fn()
    }
  }));
});

jest.mock('../services/paypal.service');

describe('Payment Service Tests', () => {
  const mockStripeInstance = {
    paymentIntents: {
      create: jest.fn()
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const stripe = require('stripe');
    stripe.mockReturnValue(mockStripeInstance);
  });

  describe('Credit Card Payment', () => {
    test('should process credit card payment successfully', async () => {
      const orderData = {
        total: 100.50,
        orderId: 'order_123'
      };

      const result = await processPayment('Card', orderData);

      expect(result.success).toBe(true);
      expect(result.clientSecret).toBe('pi_test_123_secret');
      expect(result.paymentIntentId).toBe('pi_test_123');
    });

    test('should handle credit card payment failure', async () => {
      const orderData = {
        total: 100.50,
        orderId: 'order_123'
      };

      const result = await processPayment('Card', orderData);
      expect(result.success).toBe(true);
    });
  });

  describe('PayPal Payment', () => {
    test('should process PayPal payment successfully', async () => {
      createPayPalOrder.mockResolvedValue({
        success: true,
        orderId: 'paypal_order_123',
        approvalUrl: 'https://paypal.com/approve/test'
      });

      const orderData = {
        total: 100.50,
        items: [{ name: 'Test Product', quantity: 1 }]
      };

      const result = await processPayment('PayPal', orderData);

      expect(result.success).toBe(true);
      expect(result.orderId).toBe('paypal_order_123');
      expect(result.approvalUrl).toBe('https://paypal.com/approve/test');
      expect(createPayPalOrder).toHaveBeenCalledWith(orderData);
    });

    test('should handle PayPal payment failure', async () => {
      createPayPalOrder.mockResolvedValue({
        success: false,
        error: 'PayPal service unavailable'
      });

      const orderData = {
        total: 100.50,
        items: [{ name: 'Test Product', quantity: 1 }]
      };

      const result = await processPayment('PayPal', orderData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('PayPal service unavailable');
    });
  });

  describe('Apple Pay Payment', () => {
    test('should process Apple Pay payment successfully', async () => {
      mockStripeInstance.paymentIntents.create.mockResolvedValue({
        id: 'pi_applepay_123',
        client_secret: 'pi_applepay_123_secret'
      });

      const orderData = {
        total: 100.50,
        orderId: 'order_123'
      };

      const result = await processPayment('Apple Pay', orderData);
      expect(result.success).toBe(true);
      expect(result.clientSecret).toBe('pi_applepay_123_secret');
      expect(result.paymentMethod).toBe('Apple Pay');
    });
  });

  describe('Google Pay Payment', () => {
    test('should process Google Pay payment successfully', async () => {
      const orderData = {
        total: 100.50,
        orderId: 'order_123'
      };

      const result = await processPayment('Google Pay', orderData);
      expect(result.success).toBe(true);
      expect(result.clientSecret).toBe('pi_googlepay_123_secret');
      expect(result.paymentMethod).toBe('Google Pay');
    });
  });

  describe('Cash on Delivery Payment', () => {
    test('should process COD payment successfully', async () => {
      const orderData = {
        total: 100.50,
        orderId: 'order_123'
      };

      const result = await processPayment('COD', orderData);
      expect(result.success).toBe(true);
      expect(result.paymentMethod).toBe('Cash on Delivery');
      expect(result.message).toBe('Order placed successfully. Pay on delivery.');
    });
  });

  describe('Invalid Payment Method', () => {
    test('should handle invalid payment method', async () => {
      const orderData = {
        total: 100.50,
        orderId: 'order_123'
      };

      const result = await processPayment('InvalidMethod', orderData);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid payment method');
    });
  });
});