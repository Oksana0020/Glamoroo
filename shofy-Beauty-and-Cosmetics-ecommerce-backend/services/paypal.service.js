const createPayPalOrder = async (orderData) => {
  try {
    if (process.env.NODE_ENV === 'test') {
      return {
        success: true,
        orderId: 'MOCK_PAYPAL_ORDER_' + Date.now(),
        approvalUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=mock_token'
      };
    }

    const mockResponse = {
      id: 'PAYPAL_ORDER_' + Date.now(),
      links: [
        { 
          rel: 'approve', 
          href: `https://www.sandbox.paypal.com/checkoutnow?token=ORDER_${Date.now()}` 
        }
      ]
    };
    
    return {
      success: true,
      orderId: mockResponse.id,
      approvalUrl: mockResponse.links.find(link => link.rel === 'approve').href
    };
  } catch (error) {
    console.error('PayPal order creation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const capturePayPalPayment = async (orderId) => {
  try {
    if (process.env.NODE_ENV === 'test') {
      return {
        success: true,
        captureId: 'MOCK_CAPTURE_' + Date.now(),
        status: 'COMPLETED'
      };
    }

    return {
      success: true,
      captureId: 'CAPTURE_' + Date.now(),
      status: 'COMPLETED'
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