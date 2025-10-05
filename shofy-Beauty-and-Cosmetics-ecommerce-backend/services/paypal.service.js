const { PayPalApi, OrdersController } = require('@paypal/paypal-server-sdk');

// PayPal environment setup
const environment = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';

const paypalClient = new PayPalApi({
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  environment: environment
});

// Create PayPal order
const createPayPalOrder = async (orderData) => {
  try {
    const ordersController = new OrdersController(paypalClient);
    
    const request = {
      body: {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: orderData.total.toString()
          },
          description: `Order from Shofy - ${orderData.items.length} items`
        }],
        application_context: {
          return_url: process.env.STORE_URL + '/order/success',
          cancel_url: process.env.STORE_URL + '/checkout',
          brand_name: 'Shofy',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW'
        }
      }
    };

    const response = await ordersController.ordersCreate(request);
    const order = response.result;
    
    return {
      success: true,
      orderId: order.id,
      approvalUrl: order.links.find(link => link.rel === 'approve').href
    };
  } catch (error) {
    console.error('PayPal order creation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Capture PayPal payment
const capturePayPalPayment = async (orderId) => {
  try {
    const ordersController = new OrdersController(paypalClient);
    
    const request = {
      id: orderId,
      body: {}
    };

    const response = await ordersController.ordersCapture(request);
    const order = response.result;
    
    return {
      success: true,
      captureId: order.purchase_units[0].payments.captures[0].id,
      status: order.status
    };
  } catch (error) {
    console.error('PayPal payment capture failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  createPayPalOrder,
  capturePayPalPayment
};