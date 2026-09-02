const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  {
    name: 'دمنوش‌ها',
    description: 'انواع دمنوش‌های گیاهی'
  },
  {
    name: 'عرقیات',
    description: 'عرقیات گیاهی سنتی'
  },
  {
    name: 'روغن‌های گیاهی',
    description: 'روغن‌های طبیعی و گیاهی'
  },
  {
    name: 'ادویه‌جات',
    description: 'ادویه‌های طبیعی و ارگانیک'
  },
  {
    name: 'عسل و فرآورده‌ها',
    description: 'عسل طبیعی و محصولات مرتبط'
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
