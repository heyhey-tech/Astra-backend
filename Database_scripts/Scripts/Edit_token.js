const AWS = require('aws-sdk');
const dotenv = require('dotenv');

const addDataToS3Organisation = require('./Data_addtion');
const readS3Data=require('./Data_read');
const Updates3NFT=require('./Update_data');

dotenv.config();

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


async function editS3Token(bucketName,Organisation_Name,fileName, data) {
  const accessKeyId= process.env.ACCESS_KEY;
  const secretAccessKey= process.env.SECRET;


  const s3 = new AWS.S3({
    accessKeyId: 'Access_Key',
    secretAccessKey: 'Secret_Key',
  });
  console.log(Organisation_Name);


    const folder_exits = await checkFolderExists(bucketName, Organisation_Name,s3);
    console.log(folder_exits);


    if (folder_exits) {

        const fileParams = {
            Bucket: bucketName,
            Key: `${Organisation_Name}${fileName}.json`,
            Body: '{}',
        };
        const new_data = {[fileName]: data};
        await s3.upload(fileParams).promise();
        await addDataToS3Organisation(bucketName, Organisation_Name, new_data,s3,fileParams);
        const result= await readS3Data(bucketName, fileName, Organisation_Name, s3);
        console.log('New Data stored in the file:',result);
     
        return `Token Details Updated.`;
        
    } else {
       return new Error(`${Organisation_Name} does not exist.`);
    }
}

const bucketName = 'project-astra-bucket1';

// async function main() {
//     const org_name = "toysrus-nfts/";
//     const file_name= "3";
//     const data={ 
//         "name": "Discount 2",
//         "description": "29% discount on selected items",
//         "validity": "31/12/2023",
//         "image": "https://example.com/discount1.jpg",
//         "isValid": "true",
//         "value": "100",
//         "hash": "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0"
//     };
//     const content = await editS3Token(bucketName,org_name,file_name,data);
//     console.log(content);
  
//   }
// main();

module.exports = editS3Token;  