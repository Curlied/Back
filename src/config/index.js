const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  database: {
    url: process.env.DB_URL,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  email: {
    smtp: process.env.SMTP_HOST,
    port: process.env.SMTP_HOST,
    from: process.env.EMAIL_FROM,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    key: process.env.SENDGRID_KEY,
  },
  version: process.env.VERSION,
  environment: process.env.NODE_ENV,
  token: {
    secret: process.env.TOKEN_SECRET,
    expire: process.env.TOKEN_EXPIRE,
  },
  url_front: process.env.URL_FRONT,
  cache: {
    time_expire: 60,
    time_update: 600,
  },
  Aws: {
    id: process.env.AWS_ACCESS_KEY_ID_MINE,
    key: process.env.AWS_SECRET_ACCESS_KEY_MINE,
    bucket: process.env.AWS_BUCKET_NAME,
    endpoint: process.env.ENDPOINT,
    folder: process.env.FOLDER_IMAGE,
  },
};
