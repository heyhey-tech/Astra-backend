const AWS = require('aws-sdk');
const addDataToS3Organisation = require('./Data_addtion');
const readS3Data=require('./Data_read');
const Updates3NFT=require('./Update_data');

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


async function createS3Organisation(bucketName, Organisation_Name, data) {
  const s3 = new AWS.S3({
    accessKeyId: 'AKIA6IXAVOTV7A76FFP3',
    secretAccessKey: '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',
  });


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
            Key: `${Organisation_Name}${fileName}.json`,
            Body: '{}',
        };
        await s3.upload(fileParams).promise();
        await addDataToS3Organisation(bucketName, Organisation_Name, data,s3,fileParams);
        const result= await readS3Data(bucketName, fileName, Organisation_Name, s3);
        console.log('this is the Data stored in the file:',result);
        console.log('updatin file with new data');
        const new_data = { name: 'wtf RANA', price: 0.99 };
        await Updates3NFT(bucketName, Organisation_Name,fileName, new_data,s3);
        const result2= await readS3Data(bucketName, fileName, Organisation_Name, s3);
        console.log('this is the NEW Data stored in the file:',result2);

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
const Org_name = 'lee-nfts/';
const data = { name: 'Teddy Bear', price: 19.99 };
createS3Organisation(bucketName, Org_name, data)
  .then((message) => {
    console.log(message);
  })
  .catch((err) => {
    console.error(err);
  });