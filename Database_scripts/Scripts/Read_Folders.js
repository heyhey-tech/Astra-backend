const AWS = require('aws-sdk');

require('dotenv').config({ path: '.env'});

const access_key = process.env.ACCESS_KEY;
const secret_key = process.env.SECRET;



async function readAllS3Folders(org_name) {
  const s3 = new AWS.S3({
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  });
  const bucketName = 'project-astra-bucket1';
  try {
    const params = {
      Bucket: bucketName,
      Prefix: `${org_name}/`,
      Delimiter: '/'
    };

    const data = await new Promise((resolve, reject) => {
      s3.listObjectsV2(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const folders = data.CommonPrefixes.map(prefix => prefix.Prefix.replace(params.Prefix, '').slice(0, -1));
    return folders;

  } catch (err) {
    console.error('Error:', err);
  }

  return null;
}


// async function main() {
//     const org_name = "toysrus-nfts";
//     const content = await readAllS3Folders(org_name);
//     console.log(content);
 
//   }
// main();

module.exports = readAllS3Folders;