const stripe = require('stripe')(process.env.STRIPE_KEY);
const { createPayPalOrder, capturePayPalPayment } = require('./paypal.service');

// Process payment based on method
const processPayment = async (paymentMethod, orderData) => {
  switch (paymentMethod) {
    case 'Card':
      return await processStripePayment(orderData);
    
    case 'PayPal':
      return await createPayPalOrder(orderData);
    
    case 'Apple Pay':
      return await processApplePayWithStripe(orderData);
    
    case 'Google Pay':
      return await processGooglePayWithStripe(orderData);
    
    case 'COD':
      return {
        success: true,
        paymentMethod: 'Cash on Delivery',
        message: 'Order placed successfully. Pay on delivery.'
      };
    
    default:
      return {
        success: false,
        error: 'Invalid payment method'
      };
  }
};

// Process Stripe payment fCredit Card)
const processStripePayment = async (orderData) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderData.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderData.orderId
      }
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Process Apple Pay via Stripe
const processApplePayWithStripe = async (orderData) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderData.total * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId: orderData.orderId,
        paymentMethod: 'Apple Pay'
      }
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentMethod: 'Apple Pay'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Process Google Pay via Stripe
const processGooglePayWithStripe = async (orderData) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderData.total * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId: orderData.orderId,
        paymentMethod: 'Google Pay'
      }
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentMethod: 'Google Pay'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  processPayment,
  capturePayPalPayment
};