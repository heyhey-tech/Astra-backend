const AWS = require('aws-sdk');


function appendToS3Organisation(bucketName, Organisation_Name, data,s3,fileParam) {

    const fileParams={
      Bucket: fileParam.Bucket,
      Key: fileParam.Key,
    }
  
    return new Promise((resolve, reject) => {
      s3.getObject(fileParams, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const existingData = JSON.parse(result.Body.toString());
          const newData = Object.assign(existingData, data);
          const updatedParams = Object.assign(fileParams, { Body: JSON.stringify(newData) });
  
          s3.upload(updatedParams, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(`Data appended to ${Organisation_Name}/NFTsMetadata.json successfully.`);
            }
          });
        }
      });
    });
  }
  
  module.exports = appendToS3Organisation;
 