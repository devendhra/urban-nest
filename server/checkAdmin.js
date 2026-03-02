const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdminUser() {
  try {
    // Connect to MongoDB using the same connection string as server.js
    const mongoURI = process.env.DATABASE_URL || 'mongodb+srv://devendhra:u35dI5grbwcizzOk@deva.5ebug.mongodb.net/real?appName=deva';
    await mongoose.connect(mongoURI);

    console.log('✅ Connected to MongoDB');

    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@urbannest.com' });

    if (adminUser) {
      console.log('✅ Admin user found!');
      console.log('Email:', adminUser.email);
      console.log('Username:', adminUser.username);
      console.log('Password hash exists:', adminUser.password ? 'Yes' : 'No');
      console.log('Password starts with $2a$ (bcrypt):', adminUser.password.startsWith('$2a$'));
    } else {
      console.log('❌ Admin user not found');
    }

    // List all users
    const allUsers = await User.find({}, 'email username');
    console.log('All users in database:', allUsers.map(u => ({ email: u.email, username: u.username })));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkAdminUser();
