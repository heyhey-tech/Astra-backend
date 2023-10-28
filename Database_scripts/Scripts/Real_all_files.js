const AWS = require('aws-sdk');

require('dotenv').config({ path: '../../.env'});

const access_key = process.env.ACCESS_KEY;
const secret_key = process.env.SECRET;


async function readAllS3Files(folderName) {
  const s3 = new AWS.S3({
  accessKeyId: access_key,
      secretAccessKey: secret_key,
  });
  const bucketName = 'project-astra-bucket1';
  const params = {
    Bucket: bucketName,
    Prefix: `${folderName}/`,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const files = data.Contents;

    // Initialize an object to store the compiled metadata
    const metadata = {};

    // Iterate through the files and compile metadata
    for (const file of files) {
      if (file.Key.endsWith('.json')) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: file.Key,
        };
        const fileData = await s3.getObject(getObjectParams).promise();
        const jsonContent = JSON.parse(fileData.Body.toString());
        // console.log(jsonContent);

        // Merge the metadata from this JSON file into the result object
        Object.assign(metadata, jsonContent);
      }
    }

    // Send the compiled metadata as a JSON response
    return metadata;
  } catch (err) {
    console.error('Error:', err);
  }

  return null;
}

// async function main() {
//     const org_name = "toysrus-nfts";
//     const content = await readAllS3Files(org_name);
//     console.log(content);
 
//   }
// main();

module.exports = readAllS3Files;