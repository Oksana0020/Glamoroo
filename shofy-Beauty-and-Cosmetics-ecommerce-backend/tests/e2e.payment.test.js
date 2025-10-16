const request = require('supertest');
const app = require('../index'); 

describe('End-to-End Payment Flow Tests', () => {
  
  const testOrderData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    address: '123 Test Street',
    city: 'Test City',
    country: 'USA',
    zipCode: '12345',
    contactNo: '+1234567890',
    shippingOption: 'standard',
    orderNote: 'Test order',
    cart: [
      {
        _id: 'product_1',
        title: 'Test Product 1',
        price: 50.25,
        orderQuantity: 2
      },
      {
        _id: 'product_2',
        title: 'Test Product 2',
        price: 25.50,
        orderQuantity: 1
      }
    ],
    subTotal: 126.00,
    shippingCost: 10.00,
    discount: 0,
    totalAmount: 136.00
  };

  describe('Complete Payment Flow for Each Method', () => {
    
    test('should complete full COD order flow', async () => {
      const orderWithPayment = {
        ...testOrderData,
        payment: 'COD'
      };

      const paymentResponse = await request(app)
        .post('/api/order/process-payment')
        .send({
          paymentMethod: 'COD',
          orderData: {
            total: orderWithPayment.totalAmount,
            items: orderWithPayment.cart,
            orderId: 'test_order_' + Date.now()
          }
        });

      expect(paymentResponse.status).toBe(200);
      expect(paymentResponse.body.success).toBe(true);
      expect(paymentResponse.body.data.paymentMethod).toBe('Cash on Delivery');

      const orderResponse = await request(app)
        .post('/api/order/saveOrder')
        .send(orderWithPayment);

      expect(orderResponse.status).toBe(200);
      expect(orderResponse.body.success).toBe(true);
      expect(orderResponse.body.order).toBeDefined();
      expect(orderResponse.body.order.paymentMethod).toBe('COD');
    });

    test('should handle Credit Card payment flow', async () => {
      const paymentIntentResponse = await request(app)
        .post('/api/order/create-payment-intent')
        .send({
          price: testOrderData.totalAmount
        });

      expect(paymentIntentResponse.status).toBe(200);
      expect(paymentIntentResponse.body.clientSecret).toBeDefined();

      const paymentResponse = await request(app)
        .post('/api/order/process-payment')
        .send({
          paymentMethod: 'Card',
          orderData: {
            total: testOrderData.totalAmount,
            items: testOrderData.cart,
            orderId: 'test_order_' + Date.now()
          }
        });

      expect(paymentResponse.status).toBe(200);
      expect(paymentResponse.body.success).toBe(true);
      expect(paymentResponse.body.data.clientSecret).toBeDefined();
    });

    test('should handle PayPal payment flow', async () => {
      const paymentResponse = await request(app)
        .post('/api/order/process-payment')
        .send({
          paymentMethod: 'PayPal',
          orderData: {
            total: testOrderData.totalAmount,
            items: testOrderData.cart,
            orderId: 'test_order_' + Date.now()
          }
        });

      // PayPal should return approval URL for redirect
      expect(paymentResponse.status).toBe(200);
      expect(paymentResponse.body.success).toBe(true);
    });

    test('should handle Apple Pay payment flow', async () => {
      const paymentResponse = await request(app)
        .post('/api/order/process-payment')
        .send({
          paymentMethod: 'Apple Pay',
          orderData: {
            total: testOrderData.totalAmount,
            items: testOrderData.cart,
            orderId: 'test_order_' + Date.now()
          }
        });

      expect(paymentResponse.status).toBe(200);
      expect(paymentResponse.body.success).toBe(true);
      expect(paymentResponse.body.data.paymentMethod).toBe('Apple Pay');
    });

    test('should handle Google Pay payment flow', async () => {
      const paymentResponse = await request(app)
        .post('/api/order/process-payment')
        .send({
          paymentMethod: 'Google Pay',
          orderData: {
            total: testOrderData.totalAmount,
            items: testOrderData.cart,
            orderId: 'test_order_' + Date.now()
          }
        });

      expect(paymentResponse.status).toBe(200);
      expect(paymentResponse.body.success).toBe(true);
      expect(paymentResponse.body.data.paymentMethod).toBe('Google Pay');
    });
  });

  describe('Error Handling Tests', () => {
    
    test('should handle invalid payment method', async () => {
      const paymentResponse = await request(app)
        .post('/api/order/process-payment')
        .send({
          paymentMethod: 'InvalidMethod',
          orderData: {
            total: testOrderData.totalAmount,
            items: testOrderData.cart,
            orderId: 'test_order_' + Date.now()
          }
        });

      expect(paymentResponse.status).toBe(400);
      expect(paymentResponse.body.success).toBe(false);
    });

    test('should handle missing order data', async () => {
      const paymentResponse = await request(app)
        .post('/api/order/process-payment')
        .send({
          paymentMethod: 'Card'
        });

      expect(paymentResponse.status).toBeGreaterThanOrEqual(400);
    });

    test('should handle zero amount', async () => {
      const paymentResponse = await request(app)
        .post('/api/order/process-payment')
        .send({
          paymentMethod: 'Card',
          orderData: {
            total: 0,
            items: [],
            orderId: 'test_order_' + Date.now()
          }
        });

      expect(paymentResponse.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Order Status Tests', () => {
    
    test('should retrieve order status', async () => {
      const orderWithPayment = {
        ...testOrderData,
        payment: 'COD'
      };

      const orderResponse = await request(app)
        .post('/api/order/saveOrder')
        .send(orderWithPayment);

      const orderId = orderResponse.body.order._id;

      const getOrderResponse = await request(app)
        .get(`/api/order/${orderId}`);

      expect(getOrderResponse.status).toBe(200);
      expect(getOrderResponse.body._id).toBe(orderId);
      expect(getOrderResponse.body.paymentMethod).toBe('COD');
    });

    test('should update order status', async () => {
      const orderWithPayment = {
        ...testOrderData,
        payment: 'COD'
      };

      const orderResponse = await request(app)
        .post('/api/order/saveOrder')
        .send(orderWithPayment);

      const orderId = orderResponse.body.order._id;

      const updateResponse = await request(app)
        .patch(`/api/order/update-status/${orderId}`)
        .send({ status: 'processing' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
    });
  });
});