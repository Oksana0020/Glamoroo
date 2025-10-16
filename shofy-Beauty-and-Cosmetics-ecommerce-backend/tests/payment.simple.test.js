const { processPayment } = require('../services/payment.service');

jest.mock('stripe', () => () => ({
  paymentIntents: {
    create: jest.fn()
  }
}));

jest.mock('../services/paypal.service', () => ({
  createPayPalOrder: jest.fn()
}));

describe('Payment Service Tests - Unit Tests', () => {
  
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

  describe('PayPal Payment', () => {
    test('should process PayPal payment successfully', async () => {
      const { createPayPalOrder } = require('../services/paypal.service');
      
      // Mock successful PayPal response
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
      const { createPayPalOrder } = require('../services/paypal.service');
      
      // Mock PayPal error
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

  describe('Payment Method Validation', () => {
    test('should handle all supported payment methods', async () => {
      const orderData = {
        total: 100.50,
        orderId: 'order_123',
        items: [{ name: 'Test Product', quantity: 1 }]
      };

      const supportedMethods = ['COD', 'PayPal'];
      
      for (const method of supportedMethods) {
        const result = await processPayment(method, orderData);
        // All methods should at least not throw errors
        expect(result).toBeDefined();
        expect(result).toHaveProperty('success');
      }
    });
  });
});