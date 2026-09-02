const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminExists = await User.findOne({ email: 'admin@herbalshop.com' });

    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: 'admin@herbalshop.com',
      password: 'admin123456',
      phone: '09123456789',
      role: 'admin'
    });

    console.log('Admin created successfully');
    console.log('Email: admin@herbalshop.com');
    console.log('Password: admin123456');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
