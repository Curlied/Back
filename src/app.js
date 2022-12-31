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
const expressJSDocSwagger = require('express-jsdoc-swagger');

const whitelist = [config.url_front];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if (whitelist.includes(origin))
      return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  }
};
const options = {
  info: {
    version: '1.0.0',
    title: 'Curlied swagger',
    license: {
      name: 'MIT',
    },
    description: 'The swagger method for curlied API.',
    termsOfService: 'https://brikev.github.io/express-jsdoc-swagger-docs/#/',
  },
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './**/*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v3/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {
    swaggerOptions: {
      operationsSorter: (a, b) => {
        var methodsOrder = ["get", "post", "put", "patch", "delete", "options", "trace"];
        var result = methodsOrder.indexOf(a.get("method")) - methodsOrder.indexOf(b.get("method"));

        if (result === 0) {
          result = a.get("path").localeCompare(b.get("path"));
        }

        return result;
      }
    }
  },
  // multiple option in case you want more that one instance
  multiple: true,
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'The local API server',
    }
  ]
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

expressJSDocSwagger(app)(options);
// All the api routes
app.use('/api', routes);

// Error handling not found
app.use((req, res, next) => {
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  errorF(error.message, error, httpStatus.NOT_FOUND, res, next);
});

module.exports = app;
