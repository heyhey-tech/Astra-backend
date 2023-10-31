const AWS = require('aws-sdk');
require('dotenv').config({ path: '.env'});

// const myVariable = process.env.RPC_ENDPOINT;
const access_key = process.env.ACCESS_KEY;
const secret_key = process.env.SECRET;


// const AWS = require('aws-sdk');

async function checkFileExists(params,s3) {
  // const s3 = new AWS.S3({
  //   accessKeyId: process.env.ACCESS_KEY,
  //   secretAccessKey: process.env.SECRET
  // });

  // const params = {
  //   Bucket: bucketName,
  //   Key: key
  // };

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

async function readS3Data(bucketName,nft_name, Organisation_Name) {
    // const bucketName = 'project-astra-bucket1';
    const s3 = new AWS.S3({
        accessKeyId: access_key,
      secretAccessKey: secret_key,
    });
  
    const fileParams = {
        Bucket: bucketName,
        Key: `${Organisation_Name}${nft_name}.json`,
      };

    const exists = await checkFileExists(fileParams,s3);
    if (!exists) {
        return new Error(`file does not exist.`);
    }
    console.log(fileParams.Key);
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
 



  module.exports = readS3Data;
