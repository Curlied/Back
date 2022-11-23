const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./config/index');
const routes = require('./routes');
const fileUpload = require('express-fileupload');
const errorF = require('./utils/error');
const cookieParser = require('cookie-parser');

const whitelist = [config.url_front];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if (whitelist.includes(origin))
      return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  }
};

const app = express();
app.use(cookieParser());

app.set('trust proxy', 1);

app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json());
app.use(fileUpload());

// Routes to test the API
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄👨‍🔧🐱‍🚀✌',
    env: config.environment,
    port: config.port,
    version: config.version,
  });
});

// Handle syntax error
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    errorF(error.message, error, 500, res, next);
  } else {
    next();
  }
});

// All the api routes
app.use('/api', routes);

// Error handling not found
app.use((req, res, next) => {
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  errorF(error.message, error, httpStatus.NOT_FOUND, res, next);
});

module.exports = app;
