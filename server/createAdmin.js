const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdminUser() {
  try {
    // Connect to MongoDB using the same connection string as server.js
    const mongoURI = process.env.DATABASE_URL || 'mongodb+srv://devendhra:u35dI5grbwcizzOk@deva.5ebug.mongodb.net/real?appName=deva';
    await mongoose.connect(mongoURI);

    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@urbannest.com' });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@urbannest.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      phone: '1234567890',
      email: 'admin@urbannest.com',
      password: 'admin123' // This will be hashed by the pre-save middleware
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@urbannest.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

createAdminUser();
