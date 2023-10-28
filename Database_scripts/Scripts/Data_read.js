const AWS = require('aws-sdk');


function readS3Data(bucketName,nft_name, Organisation_Name) {
    const s3 = new AWS.S3({
        accessKeyId: 'access_key',
      secretAccessKey: 'secret_key',
    });
  
    const fileParams = {
        Bucket: bucketName,
        Key: `${Organisation_Name}${nft_name}.json`,
      };
    
    return new Promise((resolve, reject) => {
        s3.getObject(fileParams, (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            const fileContent = JSON.parse(result.Body.toString());
            resolve(fileContent);
          }
        });
      });
  }
 
  // const bucketName = 'project-astra-bucket1';
  // const fileName = '2';
  // const folderName = 'toysrus-nfts';
  // readS3Data(bucketName, fileName, folderName)
  //   .then((message) => {
  //     console.log(message);
  //   })

  module.exports = readS3Data;
