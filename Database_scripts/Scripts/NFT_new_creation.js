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


async function createS3Token(bucketName,Organisation_Name, data) {
  const accessKeyId= process.env.ACCESS_KEY;
  const secretAccessKey= process.env.SECRET;

  console.log(accessKeyId);
  console.log(secretAccessKey);
  const s3 = new AWS.S3({
    accessKeyId: 'Access_Key',
    secretAccessKey: 'Secret_Key',
  });
  // const Organisation_Name = data.org_name;
  console.log(Organisation_Name);


    const folder_exits = await checkFolderExists(bucketName, Organisation_Name,s3);
    console.log(folder_exits);

    // var totalFiles = await getTotalFilesInFolder(bucketName, Organisation_Name,s3);
    // console.log(totalFiles);
    if (folder_exits) {

        const totalFiles = await getTotalFilesInFolder(bucketName, Organisation_Name,s3);
        console.log(totalFiles);
        const fileName=totalFiles;;
        
        const fileParams = {
            Bucket: bucketName,
            Key: `${Organisation_Name}/${fileName}.json`,
            Body: '{}',
        };
        const new_data = {[fileName]: data};
        await s3.upload(fileParams).promise();
        await addDataToS3Organisation(bucketName, Organisation_Name, new_data,s3,fileParams);
        const result= await readS3Data(bucketName, fileName, Organisation_Name, s3);
        console.log('this is the Data stored in the file:',result);
     
        return `Folder ${Organisation_Name} already exists. New JSON file added to the folder.`;
        
    } else {
        const folderParams = {
            Bucket: bucketName,
            Key: Organisation_Name,
            Body: '',
        };
        const fileParams = {
            Bucket: bucketName,
            Key: `${Organisation_Name}1.json`,
            Body: '{}',
        };
        await s3.upload(folderParams).promise();
        await s3.upload(fileParams).promise();
        await addDataToS3Organisation(bucketName, Organisation_Name, data,s3,fileParams);
        const result= await readS3Data(bucketName, '1', Organisation_Name, s3);
        console.log('this is the Data stored in the file:',result);
        return `Folder ${Organisation_Name} created successfully with new JSON file.`;
    }
}

const bucketName = 'project-astra-bucket1';
// const Org_name = 'lee-nfts/';
// const data = { org_name: 'Toysrus',name: 'Teddy Bear', price: 19.99 };
// createS3Token(bucketName, data)
//   .then((message) => {
//     console.log(message);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
// const data={ org_name: 'toysrus-nfts/', 
//     data: { 
//         token_name: 'Toysrus',
//         token_symbol: 'TRU',
//         token_description: 'Toysrus',
//         token_image: 'https://www.toysrus.com/graphics/tru_prod_images/Disney-Pixar-Toy-Story-4-Bo-Peep-Action-Staff--pTRU1-32590364dt.jpg',
//         token_external_url: 'https://www.toysrus.com/graphics/tru_prod_images/Disney-Pixar-Toy-Story-4-Bo-Peep-Action-Staff--pTRU1-32590364dt.jpg',
//         token_animation_url: 'https://www.toysrus.com/graphics/tru_prod_images/Disney-Pixar-Toy-Story-4-Bo-Peep-Action-Staff--pTRU1-32590364dt.jpg',
//         token_background_color: '#FFFFFF',
//         token_attributes: [ 
//             { trait_type: 'Brand', value: 'Toysrus' },
//             { trait_type: 'Discount', value: '10%' },
//             { trait_type: 'Category', value: 'Toys' },
//             { trait_type: 'Expiry', value: '10/10/2021' } 
//         ] 
//     } 
// };
// createS3Token(bucketName, data)
//   .then((message) => {
//     console.log(message);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

module.exports = createS3Token;  