const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');
const constants = require('../utils/Constantes');
const config = require('../config/index');

const Cache = new NodeCache({
  stdTTL: config.cache.time_expire,
  checkperiod: config.cache.time_update,
});

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

const sendHtmlEmail = async (to, subject, html) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    html,
  };
  await transport.sendMail(msg);
};

const GetTempURl = (emailUser) => {
  // let CacheKey =
  //   crypto.randomBytes(16).toString('base64') + new Date().getTime();
  let CacheKey;

  // be sure you don't have a same magic key in memory
  // eslint-disable-next-line no-constant-condition
  while (true) {
    CacheKey = constants.uuid().trim().trimStart().trimEnd();
    if (Cache.has(CacheKey) == true) {
      continue;
    }
    break;
  }

  Cache.set(CacheKey, emailUser);
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
