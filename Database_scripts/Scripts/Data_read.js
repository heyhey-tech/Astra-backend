const AWS = require('aws-sdk');


function readS3Data(bucketName,nft_name, Organisation_Name) {
    const s3 = new AWS.S3({
      accessKeyId:'Secret_Key',
      secretAccessKey:'Secret_Key',
    });
  
    const fileParams = {
        Bucket: bucketName,
        Key: `${Organisation_Name}/${nft_name}.json`,
      };
    
    return new Promise((resolve, reject) => {
        s3.getObject(fileParams, (err, result) => {
          if (err) {
            reject(err);
          } else {
            const fileContent = JSON.parse(result.Body.toString());
            resolve(fileContent);
          }
        });
      });
  }
  
  module.exports = readS3Data;
