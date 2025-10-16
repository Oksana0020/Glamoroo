#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Payment Methods Test Suite\n');

const tests = [
  {
    name: 'Payment Service Unit Tests',
    command: 'npm run test:payment',
    description: 'Tests all payment method processing logic'
  },
  {
    name: 'PayPal Integration Tests',
    command: 'npm run test:paypal',
    description: 'Tests PayPal service integration'
  },
  {
    name: 'Stripe Integration Tests',
    command: 'npm run test:stripe',
    description: 'Tests Stripe payment processing'
  },
  {
    name: 'Order API Tests',
    command: 'npm run test:api',
    description: 'Tests payment processing API endpoints'
  },
  {
    name: 'End-to-End Payment Tests',
    command: 'npm run test:e2e',
    description: 'Tests complete payment flows'
  }
];

async function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`\n Running: ${test.name}`);
    console.log(` ${test.description}`);
    console.log(` Command: ${test.command}\n`);

    const process = spawn('npm', ['run', test.command.split(' ')[2]], {
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(` ${test.name} - PASSED\n`);
        resolve();
      } else {
        console.log(` ${test.name} - FAILED\n`);
        reject(new Error(`Test failed with code ${code}`));
      }
    });

    process.on('error', (err) => {
      console.log(` ${test.name} - ERROR: ${err.message}\n`);
      reject(err);
    });
  });
}

async function runAllTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await runTest(test);
      passed++;
    } catch (error) {
      failed++;
      console.log(`Error in ${test.name}:`, error.message);
    }
  }

  console.log('\n Test Suite Complete!');
  console.log(` Passed: ${passed}`);
  console.log(` Failed: ${failed}`);
  console.log(` Total: ${passed + failed}`);

  if (failed === 0) {
    console.log('\n All payment methods are working correctly!');
    process.exit(0);
  } else {
    console.log('\n Some payment methods have issues. Check the logs above.');
    process.exit(1);
  }
}

// Run individual test if specified
const testName = process.argv[2];
if (testName) {
  const test = tests.find(t => t.command.includes(testName));
  if (test) {
    runTest(test).catch(console.error);
  } else {
    console.log('Available tests:');
    tests.forEach(t => console.log(`- ${t.command.split(':')[1]}`));
  }
} else {
  runAllTests().catch(console.error);
}