const stripe = require('stripe');

jest.mock('stripe');

describe('Stripe Integration Tests', () => {
  let mockStripe;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockStripe = {
      paymentIntents: {
        create: jest.fn(),
        retrieve: jest.fn(),
        confirm: jest.fn()
      }
    };
    
    stripe.mockReturnValue(mockStripe);
  });

  describe('Payment Intent Creation', () => {
    test('should create payment intent for credit card', async () => {

      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret_456',
        amount: 10050,
        currency: 'usd',
        status: 'requires_payment_method'
      });

      const stripeInstance = stripe('test_key');
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: 10050, 
        currency: 'usd',
        payment_method_types: ['card']
      });

      expect(paymentIntent.id).toBe('pi_test_123');
      expect(paymentIntent.client_secret).toBe('pi_test_123_secret_456');
      expect(paymentIntent.amount).toBe(10050);
      expect(paymentIntent.currency).toBe('usd');
    });

    test('should create payment intent for Apple Pay', async () => {

      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_applepay_123',
        client_secret: 'pi_applepay_123_secret',
        amount: 5000,
        currency: 'usd',
        payment_method_types: ['card']
      });

      const stripeInstance = stripe('test_key');
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: 5000,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          paymentMethod: 'Apple Pay'
        }
      });

      expect(paymentIntent.id).toBe('pi_applepay_123');
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 5000,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          paymentMethod: 'Apple Pay'
        }
      });
    });

    test('should create payment intent for Google Pay', async () => {

      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_googlepay_123',
        client_secret: 'pi_googlepay_123_secret',
        amount: 7500,
        currency: 'usd',
        payment_method_types: ['card']
      });

      const stripeInstance = stripe('test_key');
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: 7500,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          paymentMethod: 'Google Pay'
        }
      });

      expect(paymentIntent.id).toBe('pi_googlepay_123');
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 7500,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          paymentMethod: 'Google Pay'
        }
      });
    });

    test('should handle Stripe API errors', async () => {

      mockStripe.paymentIntents.create.mockRejectedValue({
        type: 'StripeCardError',
        code: 'card_declined',
        message: 'Your card was declined.'
      });

      const stripeInstance = stripe('test_key');
      
      await expect(stripeInstance.paymentIntents.create({
        amount: 10050,
        currency: 'usd',
        payment_method_types: ['card']
      })).rejects.toMatchObject({
        type: 'StripeCardError',
        code: 'card_declined',
        message: 'Your card was declined.'
      });
    });

    test('should handle invalid amount errors', async () => {

      mockStripe.paymentIntents.create.mockRejectedValue({
        type: 'StripeInvalidRequestError',
        message: 'Amount must be at least $0.50 usd'
      });

      const stripeInstance = stripe('test_key');
      
      await expect(stripeInstance.paymentIntents.create({
        amount: 25, 
        currency: 'usd',
        payment_method_types: ['card']
      })).rejects.toMatchObject({
        type: 'StripeInvalidRequestError',
        message: 'Amount must be at least $0.50 usd'
      });
    });
  });

  describe('Payment Intent Confirmation', () => {
    test('should confirm payment intent successfully', async () => {

      mockStripe.paymentIntents.confirm.mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 10050,
        currency: 'usd'
      });

      const stripeInstance = stripe('test_key');
      const confirmedPayment = await stripeInstance.paymentIntents.confirm('pi_test_123', {
        payment_method: 'pm_card_visa'
      });

      expect(confirmedPayment.status).toBe('succeeded');
      expect(confirmedPayment.id).toBe('pi_test_123');
    });

    test('should handle payment confirmation failure', async () => {

      mockStripe.paymentIntents.confirm.mockRejectedValue({
        type: 'StripeCardError',
        code: 'authentication_required',
        message: 'This payment requires authentication.'
      });

      const stripeInstance = stripe('test_key');
      
      await expect(stripeInstance.paymentIntents.confirm('pi_test_123', {
        payment_method: 'pm_card_visa'
      })).rejects.toMatchObject({
        type: 'StripeCardError',
        code: 'authentication_required'
      });
    });
  });
});