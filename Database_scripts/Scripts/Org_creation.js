const AWS = require('aws-sdk');
require('dotenv').config({ path: '../../.env'});

const access_key = process.env.ACCESS_KEY;
const secret_key = process.env.SECRET;


function createS3Organisation(bucketName, Organisation_Name) {
    const s3 = new AWS.S3({
      accessKeyId: access_key,
      secretAccessKey: secret_key,
      });
    const folderParams = {
      Bucket: bucketName,
      Key: Organisation_Name,
      Body: '',
    };
  
    // const fileParams = {
    //   Bucket: bucketName,
    //   Key: `${Organisation_Name}NFTsMetadata.json`,
    //   Body: '{}',
    // };

    return new Promise((resolve, reject) => {
      s3.upload(folderParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
        //   s3.upload(fileParams, (err, data) => {
        //     if (err) {
        //       reject(err);
        //     } else {
            resolve(`Folder ${Organisation_Name} created successfully .`);
            // }
        //   });
        }
      });
    });
  }
  
  // const bucketName = 'project-astra-bucket1';
  // const folderName = 'toysrus-nfts/';
  // createS3Organisation(bucketName, folderName)
  //   .then((message) => {
  //     console.log(message);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });