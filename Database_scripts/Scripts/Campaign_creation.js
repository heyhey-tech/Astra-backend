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


async function createS3Campaign(bucketName,Organisation_name, Campaign_name) {
  // const accessKeyId= process.env.ACCESS_KEY;
  // const secretAccessKey= process.env.SECRET;


  const Campaign_Folder = `${Organisation_name}/${Campaign_name}/`
  const s3 = new AWS.S3({
      accessKeyId: access_key,
      secretAccessKey: secret_key,
  });
  // const Organisation_Name = data.org_name;
  console.log(Campaign_Folder);


    const folder_exits = await checkFolderExists(bucketName, Campaign_Folder,s3);
    // console.log(folder_exits);

    // var totalFiles = await getTotalFilesInFolder(bucketName, Organisation_Name,s3);
    // console.log(totalFiles);
    if (folder_exits) {
     
        return `Folder ${folder_exits} already exists. `;
        
    } else {
        const folderParams = {
            Bucket: bucketName,
            Key: Campaign_Folder,
            Body: '',
        };
       
        await s3.upload(folderParams).promise();
        return `Folder ${createS3Campaign} created successfully.`;
    }
}

// const bucketName = 'project-astra-bucket1';

// createS3Campaign(bucketName,'toysrus-nfts','campaign1').then((message)=>{
//     console.log(message);
//     })
//     .catch((err)=>{
//         console.log(err);
//     });


module.exports = createS3Campaign;  