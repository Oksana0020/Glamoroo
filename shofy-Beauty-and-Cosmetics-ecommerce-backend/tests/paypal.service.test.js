const { createPayPalOrder, capturePayPalPayment } = require('../services/paypal.service');

jest.mock('@paypal/paypal-server-sdk', () => ({
  PayPalApi: jest.fn().mockImplementation(() => ({})),
  OrdersController: jest.fn().mockImplementation(() => ({
    ordersCreate: jest.fn(),
    ordersCapture: jest.fn()
  }))
}));

const { PayPalApi, OrdersController } = require('@paypal/paypal-server-sdk');

describe('PayPal Service Tests', () => {
  let mockOrdersController;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockOrdersController = {
      ordersCreate: jest.fn(),
      ordersCapture: jest.fn()
    };
    
    OrdersController.mockImplementation(() => mockOrdersController);
  });

  describe('createPayPalOrder', () => {
    test('should create PayPal order successfully', async () => {
      mockOrdersController.ordersCreate.mockResolvedValue({
        result: {
          id: 'PAYPAL_ORDER_123',
          links: [
            { rel: 'approve', href: 'https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL_ORDER_123' },
            { rel: 'self', href: 'https://api.sandbox.paypal.com/v2/checkout/orders/PAYPAL_ORDER_123' }
          ]
        }
      });

      const orderData = {
        total: 100.50,
        items: [
          { name: 'Test Product 1', quantity: 1 },
          { name: 'Test Product 2', quantity: 2 }
        ]
      };

      const result = await createPayPalOrder(orderData);

      expect(result.success).toBe(true);
      expect(result.orderId).toBe('PAYPAL_ORDER_123');
      expect(result.approvalUrl).toBe('https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL_ORDER_123');
      
      expect(mockOrdersController.ordersCreate).toHaveBeenCalledWith({
        body: {
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: '100.5'
            },
            description: 'Order from Shofy - 2 items'
          }],
          application_context: {
            return_url: process.env.STORE_URL + '/order/success',
            cancel_url: process.env.STORE_URL + '/checkout',
            brand_name: 'Shofy',
            landing_page: 'BILLING',
            user_action: 'PAY_NOW'
          }
        }
      });
    });

    test('should handle PayPal order creation failure', async () => {

      mockOrdersController.ordersCreate.mockRejectedValue(new Error('PayPal API Error'));

      const orderData = {
        total: 100.50,
        items: [{ name: 'Test Product', quantity: 1 }]
      };

      const result = await createPayPalOrder(orderData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('PayPal API Error');
    });

    test('should handle missing approval URL in PayPal response', async () => {

      mockOrdersController.ordersCreate.mockResolvedValue({
        result: {
          id: 'PAYPAL_ORDER_123',
          links: [
            { rel: 'self', href: 'https://api.sandbox.paypal.com/v2/checkout/orders/PAYPAL_ORDER_123' }
          ]
        }
      });

      const orderData = {
        total: 100.50,
        items: [{ name: 'Test Product', quantity: 1 }]
      };

      await expect(createPayPalOrder(orderData)).rejects.toThrow();
    });
  });

  describe('capturePayPalPayment', () => {
    test('should capture PayPal payment successfully', async () => {

      mockOrdersController.ordersCapture.mockResolvedValue({
        result: {
          id: 'PAYPAL_ORDER_123',
          status: 'COMPLETED',
          purchase_units: [{
            payments: {
              captures: [{
                id: 'CAPTURE_123',
                status: 'COMPLETED'
              }]
            }
          }]
        }
      });

      const orderId = 'PAYPAL_ORDER_123';
      const result = await capturePayPalPayment(orderId);

      expect(result.success).toBe(true);
      expect(result.captureId).toBe('CAPTURE_123');
      expect(result.status).toBe('COMPLETED');

      expect(mockOrdersController.ordersCapture).toHaveBeenCalledWith({
        id: orderId,
        body: {}
      });
    });

    test('should handle PayPal payment capture failure', async () => {

      mockOrdersController.ordersCapture.mockRejectedValue(new Error('Capture failed'));

      const orderId = 'PAYPAL_ORDER_123';
      const result = await capturePayPalPayment(orderId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Capture failed');
    });

    test('should handle invalid order ID', async () => {

      mockOrdersController.ordersCapture.mockRejectedValue(new Error('Order not found'));

      const orderId = 'INVALID_ORDER_ID';
      const result = await capturePayPalPayment(orderId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Order not found');
    });
  });
});