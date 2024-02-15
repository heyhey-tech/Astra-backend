const AWS = require('aws-sdk');
const addDataToS3Organisation = require('./Data_addtion');
const readS3Data=require('./Data_read');
require('dotenv').config({ path: '.env'});

const access_key = process.env.ACCESS_KEY;
const secret_key = process.env.SECRET;

async function checkFolderExists(bucketName, folderName,s3) {

    const folderParams = {
      Bucket: bucketName,
      Key: folderName,
    };
  
    try {
      await s3.headObject(folderParams).promise();
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

 async function getTotalFilesInFolder(bucketName, folderName,s3) {
   
    const params = {
      Bucket: bucketName,
      Prefix: folderName,
    };
  
    const data = await s3.listObjects(params).promise();
    const totalFiles = data.Contents.length;
  
    return totalFiles;
  }


async function editS3Token(bucketName,Organisation_name,campaign_name,fileName, data) {
  // const accessKeyId= process.env.ACCESS_KEY;
  // const secretAccessKey= process.env.SECRET;
 
  const campaign_folder = `${Organisation_name}/${campaign_name}/`;


  const s3 = new AWS.S3({
  accessKeyId: access_key,
      secretAccessKey: secret_key,
  });
  console.log(campaign_folder);


    const folder_exits = await checkFolderExists(bucketName, campaign_folder,s3);
    console.log("folder exists:",folder_exits);


    if (folder_exits) {

        const fileParams = {
            Bucket: bucketName,
            Key: `${campaign_folder}${fileName}.json`,
            Body: '{}',
        };
        console.log(fileParams.Key);
        const new_data = {[fileName]: data};
        await s3.upload(fileParams).promise();
        await addDataToS3Organisation(bucketName, campaign_folder, new_data,s3,fileParams);
        try{
        const result= await readS3Data(bucketName, fileName, campaign_folder, s3);
        return result;
        }catch(err){
            return err;
        }
        // console.log('New Data stored in the file:',result);        
    } else {
       return new Error(`${campaign_folder} does not exist.`);
    }
}

const bucketName = 'project-astra-bucket1';

// async function main() {
//     const org_name = 'toysrus-nfts';
//     const file_name= '19';
//     const campaign_name = 'campaign1';
//     const data={ 
//         "name": "Discount 2",
//         "description": "29% discount on selected items",
//         "validity": "31/12/2023",
//         "image": "https://example.com/discount1.jpg",
//         "isValid": "true",
//         "value": "100",
//         "hash": "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0"
//     };
//     const content = await editS3Token(bucketName,org_name,campaign_name,file_name,data);
//     console.log(content);
  
//   }
// main();

module.exports = editS3Token;  