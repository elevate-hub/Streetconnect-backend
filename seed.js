require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const MenuItem = require('./models/MenuItem');
const Customer = require('./models/Customer');
const DeliveryPartner = require('./models/DeliveryPartner');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Vendor.deleteMany({}), MenuItem.deleteMany({}),
    Customer.deleteMany({}), DeliveryPartner.deleteMany({})
  ]);

  const password = await bcrypt.hash('password123', 10);

  // Admin
  await User.create({ name: 'Admin', email: 'admin@streetconnect.in', phone: '9000000000', password, role: 'admin' });

  // Customers
  const custUser1 = await User.create({ name: 'Priya Sharma', email: 'priya@test.com', phone: '9876543210', password, role: 'customer' });
  const custUser2 = await User.create({ name: 'Rahul Kumar', email: 'rahul@test.com', phone: '9876543211', password, role: 'customer' });
  await Customer.create({ user_id: custUser1._id, saved_addresses: ['123, Koramangala 4th Block, Bengaluru'] });
  await Customer.create({ user_id: custUser2._id, saved_addresses: ['45, Indiranagar, Bengaluru'] });

  // Vendors
  const vendorUser1 = await User.create({ name: 'Raju', email: 'raju@test.com', phone: '9876543212', password, role: 'vendor' });
  const vendorUser2 = await User.create({ name: 'Meena', email: 'meena@test.com', phone: '9876543213', password, role: 'vendor' });

  const v1 = await Vendor.create({
    user_id: vendorUser1._id,
    stall_name: { en: "Raju's Dosa Corner", kn: 'ರಾಜುವಿನ ದೋಸೆ ಕಾರ್ನರ್', hi: 'राजू का डोसा कॉर्नर' },
    description: { en: 'Best South Indian breakfast in town', kn: 'ಪಟ್ಟಣದ ಅತ್ಯುತ್ತಮ ದಕ್ಷಿಣ ಭಾರತೀಯ ಉಪಹಾರ', hi: 'शहर का सबसे अच्छा दक्षिण भारतीय नाश्ता' },
    cuisine_type: 'South Indian',
    address: 'Near BDA Complex, Koramangala, Bengaluru',
    opening_time: '06:00', closing_time: '11:00',
    days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    is_open: true, is_active: true, approval_status: 'approved',
    onboarding_completed: true, average_rating: 4.5, total_reviews: 12
  });

  const v2 = await Vendor.create({
    user_id: vendorUser2._id,
    stall_name: { en: 'Mumbai Chaat House', kn: 'ಮುಂಬೈ ಚಾಟ್ ಹೌಸ್', hi: 'मुंबई चाट हाउस' },
    description: { en: 'Authentic Mumbai street food', kn: 'ಅಸಲಿ ಮುಂಬೈ ಬೀದಿ ಆಹಾರ', hi: 'असली मुंबई स्ट्रीट फूड' },
    cuisine_type: 'Snacks',
    address: 'MG Road, Bengaluru',
    opening_time: '10:00', closing_time: '22:00',
    days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    is_open: true, is_active: true, approval_status: 'approved',
    onboarding_completed: true, average_rating: 4.2, total_reviews: 8
  });

  // Menu items
  const items = [
    { vendor_id: v1._id, name: { en: 'Masala Dosa', kn: 'ಮಸಾಲ ದೋಸೆ', hi: 'मसाला डोसा' }, description: { en: 'Crispy dosa with potato filling', kn: 'ಆಲೂಗೆಡ್ಡೆ ಹೂರಣದೊಂದಿಗೆ ಗರಿಗರಿ ದೋಸೆ', hi: 'आलू भरावन के साथ कुरकुरा डोसा' }, price: 60, category: 'Dosa' },
    { vendor_id: v1._id, name: { en: 'Idli Vada', kn: 'ಇಡ್ಲಿ ವಡೆ', hi: 'इडली वड़ा' }, description: { en: '2 Idli + 1 Vada with chutney and sambar', kn: '2 ಇಡ್ಲಿ + 1 ವಡೆ ಚಟ್ನಿ ಮತ್ತು ಸಾಂಬಾರ್ ಜೊತೆ', hi: '2 इडली + 1 वड़ा चटनी और सांभर के साथ' }, price: 50, category: 'Breakfast' },
    { vendor_id: v1._id, name: { en: 'Filter Coffee', kn: 'ಫಿಲ್ಟರ್ ಕಾಫಿ', hi: 'फिल्टर कॉफी' }, description: { en: 'Traditional South Indian filter coffee', kn: 'ಸಾಂಪ್ರದಾಯಿಕ ದಕ್ಷಿಣ ಭಾರತೀಯ ಫಿಲ್ಟರ್ ಕಾಫಿ', hi: 'पारंपरिक दक्षिण भारतीय फिल्टर कॉफी' }, price: 20, category: 'Beverages' },
    { vendor_id: v1._id, name: { en: 'Rava Dosa', kn: 'ರವೆ ದೋಸೆ', hi: 'रवा डोसा' }, description: { en: 'Crispy semolina dosa', kn: 'ಗರಿಗರಿ ರವೆ ದೋಸೆ', hi: 'कुरकुरा सूजी डोसा' }, price: 70, category: 'Dosa' },
    { vendor_id: v2._id, name: { en: 'Pani Puri', kn: 'ಪಾನಿ ಪೂರಿ', hi: 'पानी पूरी' }, description: { en: '6 pieces with spicy water', kn: 'ಖಾರದ ನೀರಿನೊಂದಿಗೆ 6 ತುಂಡುಗಳು', hi: '6 पीस मसालेदार पानी के साथ' }, price: 30, category: 'Chaat' },
    { vendor_id: v2._id, name: { en: 'Vada Pav', kn: 'ವಡಾ ಪಾವ್', hi: 'वड़ा पाव' }, description: { en: 'Mumbai style vada pav', kn: 'ಮುಂಬೈ ಶೈಲಿಯ ವಡಾ ಪಾವ್', hi: 'मुंबई स्टाइल वड़ा पाव' }, price: 25, category: 'Snacks' },
    { vendor_id: v2._id, name: { en: 'Chole Bhature', kn: 'ಛೋಲೆ ಭಟೂರೆ', hi: 'छोले भटूरे' }, description: { en: 'Spicy chickpea curry with fried bread', kn: 'ಕಡಲೆ ಕರಿ ಕರಿದ ಬ್ರೆಡ್ ಜೊತೆ', hi: 'मसालेदार छोले पूरी के साथ' }, price: 80, category: 'Main' },
    { vendor_id: v2._id, name: { en: 'Bhel Puri', kn: 'ಭೇಲ್ ಪೂರಿ', hi: 'भेल पूरी' }, description: { en: 'Puffed rice snack', kn: 'ಉಬ್ಬಿದ ಅಕ್ಕಿ ತಿಂಡಿ', hi: 'मुरमुरे का नाश्ता' }, price: 35, category: 'Chaat' },
  ];
  await MenuItem.insertMany(items);

  // Delivery partner
  const dpUser = await User.create({ name: 'Suresh', email: 'suresh@test.com', phone: '9876543214', password, role: 'delivery' });
  await DeliveryPartner.create({ user_id: dpUser._id, is_available: true, approval_status: 'approved', earnings_total: 240, deliveries_completed: 12 });

  console.log('Seed data inserted successfully!');
  console.log('\nLogin credentials (password: password123):');
  console.log('Admin: admin@streetconnect.in');
  console.log('Customer: priya@test.com / rahul@test.com');
  console.log('Vendor: raju@test.com / meena@test.com');
  console.log('Delivery: suresh@test.com');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
