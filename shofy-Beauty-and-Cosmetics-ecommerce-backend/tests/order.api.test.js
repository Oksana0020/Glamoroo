const request = require('supertest');
const express = require('express');
const orderRoutes = require('../routes/order.routes');
const { processPayment } = require('../services/payment.service');

jest.mock('../services/payment.service');

describe('Order API Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/order', orderRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/order/process-payment', () => {
    test('should process payment successfully for all methods', async () => {
      const paymentMethods = ['Card', 'PayPal', 'Apple Pay', 'Google Pay', 'COD'];
      
      for (const method of paymentMethods) {
        processPayment.mockResolvedValue({
          success: true,
          paymentMethod: method,
          ...(method === 'Card' && { clientSecret: 'pi_test_secret' }),
          ...(method === 'PayPal' && { approvalUrl: 'https://paypal.com/approve' }),
          ...(method === 'COD' && { message: 'Order placed successfully. Pay on delivery.' })
        });

        const requestData = {
          paymentMethod: method,
          orderData: {
            total: 100.50,
            items: [{ name: 'Test Product', quantity: 1 }],
            orderId: 'order_123'
          }
        };

        const response = await request(app)
          .post('/api/order/process-payment')
          .send(requestData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(processPayment).toHaveBeenCalledWith(method, requestData.orderData);
      }
    });

    test('should handle payment processing errors', async () => {
      processPayment.mockResolvedValue({
        success: false,
        error: 'Payment processing failed'
      });

      const requestData = {
        paymentMethod: 'Card',
        orderData: {
          total: 100.50,
          items: [{ name: 'Test Product', quantity: 1 }],
          orderId: 'order_123'
        }
      };

      const response = await request(app)
        .post('/api/order/process-payment')
        .send(requestData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Payment processing failed');
    });

    test('should handle missing payment method', async () => {
      const requestData = {
        orderData: {
          total: 100.50,
          items: [{ name: 'Test Product', quantity: 1 }],
          orderId: 'order_123'
        }
      };

      const response = await request(app)
        .post('/api/order/process-payment')
        .send(requestData);

      // this should trigger an error since paymentMethod is missing
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('should validate request data structure', async () => {
      const invalidRequestData = {
        paymentMethod: 'Card'
      };

      const response = await request(app)
        .post('/api/order/process-payment')
        .send(invalidRequestData);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});