const AWS = require('aws-sdk');


function readS3Data(bucketName,nft_name, Organisation_Name) {
    const s3 = new AWS.S3({
      accessKeyId: 'secret',
      secretAccessKey: 'secret',
    });
  
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
  
  // readS3Data('project-astra-bucket1','3','toysrus-nfts').then((data) => {
  //   console.log(data);
  // }).catch((err) => {
  //   console.log(err);
  // });
  module.exports = readS3Data;
