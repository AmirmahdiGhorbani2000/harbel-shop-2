const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const products = [
      {
        name: 'چای بابونه',
        description: 'دمنوش بابونه برای آرامش اعصاب و بهبود خواب',
        price: 85000,
        discountPrice: 75000,
        category: categoryMap['دمنوش‌ها'],
        stock: 50,
        benefits: ['آرامش اعصاب', 'بهبود خواب', 'ضد التهاب'],
        usage: 'یک قاشق غذاخوری در یک لیوان آب جوش به مدت 10 دقیقه',
        sideEffects: 'در مصرف زیاد ممکن است باعث خواب آلودگی شود'
      },
      {
        name: 'عرق نعناع',
        description: 'عرق نعناع برای مشکلات گوارشی و نفخ',
        price: 45000,
        discountPrice: 0,
        category: categoryMap['عرقیات'],
        stock: 100,
        benefits: ['ضد نفخ', 'بهبود هضم', 'خوشبو کننده دهان'],
        usage: 'یک استکان بعد از غذا',
        sideEffects: 'بدون عوارض جانبی خاص'
      },
      {
        name: 'روغن سیاه دانه',
        description: 'روغن سیاه دانه برای تقویت سیستم ایمنی',
        price: 120000,
        discountPrice: 100000,
        category: categoryMap['روغن‌های گیاهی'],
        stock: 30,
        benefits: ['تقویت سیستم ایمنی', 'ضد آلرژی', 'سلامت پوست'],
        usage: 'یک قاشق چایخوری صبح ناشتا',
        sideEffects: 'در بارداری با احتیاط مصرف شود'
      },
      {
        name: 'زردچوبه',
        description: 'زردچوبه ارگانیک با خواص ضد التهابی',
        price: 65000,
        discountPrice: 0,
        category: categoryMap['ادویه‌جات'],
        stock: 80,
        benefits: ['ضد التهاب', 'آنتی اکسیدان', 'تقویت کبد'],
        usage: 'در غذاها به میزان لازم',
        sideEffects: 'مصرف زیاد ممکن است باعث مشکلات معده شود'
      },
      {
        name: 'عسل طبیعی',
        description: 'عسل طبیعی کوهستان با خواص درمانی',
        price: 250000,
        discountPrice: 220000,
        category: categoryMap['عسل و فرآورده‌ها'],
        stock: 20,
        benefits: ['تقویت سیستم ایمنی', 'انرژی زا', 'ضد باکتری'],
        usage: 'یک قاشق غذاخوری صبح ناشتا',
        sideEffects: 'برای افراد دیابتی با احتیاط'
      }
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
