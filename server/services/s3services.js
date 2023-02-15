const AWS = require("aws-sdk");
require("dotenv").config();

exports.uploadtoS3 = async (data, filename) => {
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IMA_SECRET_KEY,
  });

  var params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (error, s3response) => {
      if (error) {
        console.log("Something went wrong!", error);
        reject(error);
      } else {
        console.log("success", s3response);
        resolve(s3response);
      }
    });
  });
};
