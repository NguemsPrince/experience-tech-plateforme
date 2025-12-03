require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const productRoutes = require('./routes/products');
const newsRoutes = require('./routes/news');
const trainingRoutes = require('./routes/training');
const paymentRoutes = require('./routes/payments');
const orderRoutes = require('./routes/orders');
const forumRoutes = require('./routes/forum');
const contactRoutes = require('./routes/contact');
const careerRoutes = require('./routes/careers');
const clientRoutes = require('./routes/client');
const chatbotRoutes = require('./routes/chatbot');
const ratingRoutes = require('./routes/ratings');
const cartRoutes = require('./routes/cart');
const testimonialRoutes = require('./routes/testimonials');
const ticketRoutes = require('./routes/tickets');
const prepaidCardRoutes = require('./routes/prepaidCards');
const adminRoutes = require('./routes/admin');
const settingsRoutes = require('./routes/settings');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import Sentry (doit être avant les routes)
const { initSentry, sentryMiddleware } = require('./config/sentry');
const { isRedisAvailable } = require('./config/redis');

// Initialiser Sentry AVANT tout
if (process.env.NODE_ENV !== 'test') {
  initSentry();
}

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Sentry middleware (doit être avant les autres middlewares)
if (process.env.NODE_ENV !== 'test') {
  app.use(sentryMiddleware.requestHandler);
  app.use(sentryMiddleware.tracingHandler);
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'];
    
    // In development, allow any localhost origin
    if (process.env.NODE_ENV === 'development') {
      const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
      if (isLocalhost || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    } else {
      // In production, only allow specific origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Expérience Tech API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    redis: isRedisAvailable() ? 'connected' : 'disconnected',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Expérience Tech API - Backend Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      services: '/api/services',
      products: '/api/products',
      news: '/api/news',
      training: '/api/training',
      forum: '/api/forum',
      contact: '/api/contact',
      careers: '/api/careers',
      client: '/api/client',
      ratings: '/api/ratings',
      cart: '/api/cart',
      testimonials: '/api/testimonials',
      tickets: '/api/tickets'
    }
  });
});

// Handle favicon and other static files
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/logo192.png', (req, res) => {
  res.status(204).end();
});

app.get('/manifest.json', (req, res) => {
  res.status(204).end();
});

// Swagger API Documentation
const { swaggerSpec, swaggerUi } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none } .swagger-ui { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }',
  customSiteTitle: 'Expérience Tech API Documentation',
  customfavIcon: '/logo192.png',
  customCssUrl: null,
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/prepaid-cards', prepaidCardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use(notFound);
// Sentry error handler (avant errorHandler)
if (process.env.NODE_ENV !== 'test') {
  app.use(sentryMiddleware.errorHandler);
}
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI 
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    
    console.log('Connecting to MongoDB with URI:', mongoUri);
    
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
