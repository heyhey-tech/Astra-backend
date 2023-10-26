const AWS = require('aws-sdk');


function readS3Data(bucketName,nft_name, Organisation_Name, s3) {
    // const s3 = new AWS.S3({
    //   accessKeyId:'AKIA6IXAVOTV7A76FFP3',
    //   secretAccessKey:'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',
    // });
  
    const fileParams = {
        Bucket: bucketName,
        Key: `${Organisation_Name}${nft_name}.json`,
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
