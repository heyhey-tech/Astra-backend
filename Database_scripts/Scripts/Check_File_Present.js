const AWS = require('aws-sdk');

async function checkFileExists(bucketName, key) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET
  });

  const params = {
    Bucket: bucketName,
    Key: key
  };

  try {
    await s3.headObject(params).promise();
    return true;
  } catch (err) {
    if (err.code === 'NotFound') {
      return false;
    } else {
      console.error(err);
      throw err;
    }
  }
}