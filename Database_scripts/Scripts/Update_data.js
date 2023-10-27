const AWS = require('aws-sdk');



function Updates3NFT(bucketName, Organisation_Name,NFT_name, data,s3) {
    // const s3 = new AWS.S3({
    //   accessKeyId:'Access_Key',
    //   secretAccessKey:'Secret_Key',
    // });
  
    const fileParams = {
      Bucket: bucketName,
      Key: `${Organisation_Name}${NFT_name}.json`,
    };
  
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
              resolve(`Data appended to ${Organisation_Name}/${NFT_name}.json successfully.`);
            }
          });
        }
      });
    });
  }
  

module.exports = Updates3NFT;
