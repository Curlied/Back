const nodemailer = require('nodemailer');
const constants = require('../utils/Constantes');
const config = require('../config/index');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.email.key);

const postmark = require('postmark');
const clientPostmark = new postmark.Client(config.email.keyPostmark);

const redis = require('redis');
const client = redis.createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});


const insertConfirmPasswordKey = async (key, email) => {
  await client.connect();
  const keyRedis = `curlied:confirm_password:${key}`;
  await client.set(keyRedis, email, 'EX', 1800);
  await client.quit();
};

const getConfirmPasswordKey = async (keyToConfirm) => {
  await client.connect();
  const keyRedis = `curlied:confirm_password:${keyToConfirm}`;
  const email = await client.get(keyRedis);
  await client.quit();
  return email;
};

const deleteKey = async (key) => {
  await client.connect();
  const keyRedis = `curlied:confirm_password:${key}`;
  await client.del(keyRedis);
  await client.quit();
};

const generateRandomString = () => {
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return randomString;
};

const transport = nodemailer.createTransport({
  host: config.email.smtp,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
  tls: {
    rejectUnauthorized: false,
    ignoreTLS: false,
    requireTLS: true,
    minVersion: 'TLSv1',
  },
});

// ALL CONST
const sendEmail = async (to, subject, text) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
  };
  await transport.sendMail(msg);
};

const sendEmailSendGrip = async (to, subject, text) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    html: text,
  };
  await sgMail.send(msg);
};

const sendEmailPostmark = async (to, subject, text) => {
  const msg = {
    From: config.email.from,  
    To: to,
    Subject: subject,
    HtmlBody: text,
  };
  await clientPostmark.sendEmail(msg);
};


const sendHtmlEmail = async (to, subject, html) => {
  await new Promise(() => {
    sendEmailPostmark(to, subject, html);
  });
};

const GetTempURl = async (emailUser) => {
  const CacheKey = generateRandomString();
  await insertConfirmPasswordKey(CacheKey, emailUser);
  return config.url_front + '/confirm?key=' + CacheKey;
};

const ReplaceUserNameAndUrl = async (stringHtmlMail, username, urlTempory) => {
  stringHtmlMail = stringHtmlMail.replace(
    constants.EMAIL_REPLACE.PSEUDO,
    username
  );
  return stringHtmlMail.replace(
    constants.EMAIL_REPLACE.URL_CONFIRMATION,
    urlTempory
  );
};

module.exports = {
  sendEmail,
  sendHtmlEmail,
  GetTempURl,
  ReplaceUserNameAndUrl,
  getConfirmPasswordKey,
  deleteKey,
};
