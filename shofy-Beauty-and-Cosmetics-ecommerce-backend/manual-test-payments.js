require('dotenv').config();

const { processPayment } = require('./services/payment.service');

async function testAllPaymentMethods() {
  console.log('Testing All Payment Methods\n');
  
  const testOrderData = {
    total: 100.50,
    orderId: 'test_order_' + Date.now(),
    items: [
      { name: 'Test Product 1', quantity: 2, price: 25.25 },
      { name: 'Test Product 2', quantity: 1, price: 50.00 }
    ]
  };

  const paymentMethods = [
    'COD',
    'PayPal', 
    'Card',
    'Apple Pay',
    'Google Pay',
    'InvalidMethod'
  ];

  for (const method of paymentMethods) {
    console.log(`\nTesting: ${method}`);
    console.log('='.repeat(30));
    
    try {
      const result = await processPayment(method, testOrderData);
      if (result.success) {
        console.log('✅ SUCCESS');
        console.log('Response:', JSON.stringify(result, null, 2));
      } else {
        console.log('FAILED');
        console.log('Error:', result.error || 'Unknown error');
      }
    } catch (error) {
      console.log('EXCEPTION');
      console.log('Error:', error.message);
    }
  }
  console.log('\nPayment Method Testing Complete');
}

async function testPaymentMethodEndpoint() {
  console.log('\nTesting Payment API Endpoint');
  console.log('='.repeat(40));
  
  const testData = {
    paymentMethod: 'COD',
    orderData: {
      total: 100.50,
      items: [{ name: 'Test Product', quantity: 1 }],
      orderId: 'test_api_' + Date.now()
    }
  };

  try {
    console.log('Would send POST to /api/order/process-payment');
    console.log('Data:', JSON.stringify(testData, null, 2));
    console.log('API endpoint ready for testing');
  } catch (error) {
    console.log('API test failed:', error.message);
  }
}

async function checkEnvironmentConfiguration() {
  console.log('\nChecking Environment Configuration');
  console.log('='.repeat(40));

  const requiredEnvVars = [
    'STRIPE_KEY',
    'PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
    'PAYPAL_MODE',
    'STORE_URL',
    'ADMIN_URL'
  ];

  let missingVars = [];

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(` ${envVar}: Set`);
    } else {
      console.log(` ${envVar}: Missing`);
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.log('\n Missing environment variables:');
    missingVars.forEach(variable => console.log(`  - ${variable}`));
    console.log('\nPlease configure these in your .env file');
  } else {
    console.log('\n All environment variables configured!');
  }
}

async function runAllTests() {
  console.log(' Shofy Payment System Test Suite');

  await checkEnvironmentConfiguration();
  await testAllPaymentMethods();
  await testPaymentMethodEndpoint();

  console.log('\n Test Suite Complete!');
  console.log('\nNext Steps:');
  console.log('1. Run: npm test for automated tests');
  console.log('2. Test manually in the browser');
  console.log('3. Verify payment provider configurations');
  console.log('4. Test with real payment credentials in development');
}

// Handle command line arguments
const command = process.argv[2];
if (command === 'payments') {
  testAllPaymentMethods();
} else if (command === 'api') {
  testPaymentMethodEndpoint();
} else if (command === 'env') {
  checkEnvironmentConfiguration();
} else {
  runAllTests();
}