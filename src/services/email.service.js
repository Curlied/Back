const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');
const constants = require('../utils/Constantes');
const config = require('../config/index');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.email.key);

const Cache = new NodeCache({
  stdTTL: config.cache.time_expire,
  checkperiod: config.cache.time_update,
});

const generateRandomString = () => {
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return randomString;
};

const setRandomString = (email) => {
  const randomString = generateRandomString();
  Cache.set(randomString, email);
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

const sendEmailPostmark = async (to, subject, text) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    html: text,
  };
  await sgMail.send(msg);
};

const sendHtmlEmail = async (to, subject, html) => {
  await new Promise(() => {
    sendEmailPostmark(to, subject, html);
  });
};

const GetTempURl = (emailUser) => {
  const CacheKey = setRandomString(emailUser);
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
  Cache,
  ReplaceUserNameAndUrl,
};
