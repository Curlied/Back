const aws = require('aws-sdk');
const path = require('path');
const constants = require('../utils/Constantes');
const httpStatus = require('http-status');
const config = require('../config/index');
const spacesEndpoint = new aws.Endpoint(config.Aws.endpoint);

const s3_config = new aws.S3({
  accessKeyId: config.Aws.id,
  secretAccessKey: config.Aws.key,
  endpoint: spacesEndpoint,
});

/**
 * Generic method or push image
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const push_image = (sub_folder) => (req, res, next) => {
  if (!req || !req.files) {
    return next();
  }

  let arrayFile = Object.values(req.files);
  let arrayUrl = [];

  arrayFile.forEach((file) => {
    const timestamp = new Date().getTime();
    const extension = path.extname(file.name);
    const fileName = path.basename(file.name, extension);
    const guid = constants.uuid();
    let namefile = fileName + '-' + timestamp.toString() + guid + extension;

    let params = {
      Bucket: `${config.Aws.bucket}/${config.Aws.folder}/${sub_folder}`,
      Key: namefile,
      Body: file.data,
      ACL: 'public-read',
      ContentType: 'image/jpeg',
    };

    const putObjectPromise = s3_config.putObject(params).promise();

    putObjectPromise.catch(() => {
      const errorMessage = new Error(constants.MESSAGE.IMAGE_USER_NOT_UPLOAD);
      errorMessage.status = httpStatus.NOT_IMPLEMENTED;
      next(errorMessage);
    });

    /**
     * A way for create manually url, avoid to call get_image_profil method
     * (we've got the bucket, the name file and the endpoint i can create url)
     * if the method create any problems we can call get_image_profil
     **/
    let url = params.Key;
    arrayUrl.push(url);
  });

  if (arrayUrl.length === 0) {
    next();
  } else if (arrayUrl.length === 1) {
    req.body.url_image = arrayUrl[0];
  } else {
    req.body.url_image = arrayUrl;
  }
  next();
};

module.exports = {
  push_image,
};
