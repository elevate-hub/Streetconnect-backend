require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
console.log("ENV CHECK:", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vendor', require('./routes/vendor'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/customer', require('./routes/customer'));
app.use('/api/delivery', require('./routes/delivery'));
app.use('/api/order', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/review', require('./routes/review'));
app.use('/api/notification', require('./routes/notification'));
app.use('/api/translate', require('./routes/translate'));

app.get('/', (req, res) => {
  res.json({ message: 'StreetConnect API is running' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});