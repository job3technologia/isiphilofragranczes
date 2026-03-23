const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const { errorHandler } = require('./middleware/error');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// Static Folders
app.use(express.static(path.join(__dirname)));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/products', require('./routes/product'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/deliveries', require('./routes/delivery'));
app.use('/api/expenses', require('./routes/expense'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/recommendations', require('./routes/recommendation'));
app.use('/api/coupons', require('./routes/coupon'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});