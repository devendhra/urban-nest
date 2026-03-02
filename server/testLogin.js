const axios = require('axios');

async function testLogin() {
  console.log('🔍 Testing login functionality...');

  try {
    // Test with admin credentials
    console.log('Testing admin login...');
    const adminResponse = await axios.post('http://localhost:5000/api/login', {
      email: 'admin@urbannest.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful!');
    console.log('Token:', adminResponse.data.token.substring(0, 50) + '...');

  } catch (error) {
    console.log('❌ Admin login failed!');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }

  try {
    // Test with invalid credentials
    console.log('\nTesting invalid credentials...');
    await axios.post('http://localhost:5000/api/login', {
      email: 'invalid@email.com',
      password: 'wrongpassword'
    });
    console.log('❌ Invalid credentials test failed - should have thrown error');

  } catch (error) {
    console.log('✅ Invalid credentials correctly rejected');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }
}

testLogin();
