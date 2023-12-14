const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const CreateToken = require('./Brand/createDiscount');
const fetchAllDiscounts = require('./Brand/displayAll');
const edit = require('./Brand/editDiscount');
const getUsers = require('./Brand/getAllUsers');
const cors = require('cors');
const airdrop = require('./Brand/airDrop');
const getBalance = require('./User/displayBalance');
const redeem = require('./User/redeem');
const jwt = require('jsonwebtoken');
const { errorMonitor } = require('nodemailer/lib/xoauth2');
const secretKey = 'secret-key';
const multer = require('multer');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid').v4;
const path = require('path');
const fs = require('fs-extra');
const https=require('https');

const key=fs.readFileSync("./private.key");
const cert=fs.readFileSync("./certificate.crt");
const cred={
  key,
  cert
}
dotenv.config();

app.use(cors({origin: '*'}));
app.use(bodyParser.json());

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'image/gif') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});


app.get('/', (req, res) => {res.json('my api running');});

// app.get('/.well-known/pki-validation/0D405064B9C0649BEE660F092A5CE135.txt', (req, res) => {
//   res.sendFile('/home/ubuntu/Astra-backend/0D405064B9C0649BEE660F092A5CE135.txt');
// }
// );

app.post('/brand/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  const token = req.headers.authorization.split(' ')[1];
  try{
    jwt.verify(token, secretKey);

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    const s3 = new AWS.S3({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET
    });
  
    console.log(file);
    const fileName = `${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: 'project-astra-bucket1',
      Key: 'images/' + fileName,
      Body: file.buffer
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file: ', err);
        return res.status(500).send('Error uploading file.');
      }
  
      console.log('File uploaded successfully: ', data.Location);
      return res.status(200).send(data.Location);
    });
  }catch(err){
    console.error(err);
    res.status(400).send('Invalid token');
  }
});

app.post('/brand/createToken', async (req, res) => {
    // console.log(req);
    const token = req.headers.authorization.split(' ')[1];
    try {
      jwt.verify(token, secretKey);
      const data=req.body.data;
      const org_name=req.body.org_name;
      console.log(org_name);
      try {
          await CreateToken(org_name,data);
          res.send('Token created successfully');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error creating token');
        }
    } catch (err) {
      console.error(err);
      res.status(400).send('Invalid token');
    }
  });

app.get('/brand/getUsers', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, secretKey);
    try {
        const results = await getUsers();
        console.log("RESULT:",results);
        res.send(results);
      } catch (err) {
        console.error(err);
        res.status(400).send('Error fetching users');
      }
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid token');
  }
});



// Endpoint to fetch all the discounts
app.get('/brand/display-all', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    // console.log("here::")
    jwt.verify(token, secretKey);
    // console.log("query:",req?.query);
    const org_name=req.query.org_name;
    
      console.log("name:",org_name);
      // should return a json of the metadata of all the discounts
      const results = await fetchAllDiscounts(org_name);
      if(results instanceof Error){
        res.status(400).send('Error fetching discounts');
      }else{
        res.send(results);

      }
   
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid token');
  }
});

// Endpoint to edit the metadata of a discount with a given id
app.post('/brand/edit-discount', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, secretKey);
    const file_name = req.body.token_id;
    const org_name = req.body.org_name;
    const data= req.body.data;
    try {
        // should return a json of the metadata of all the discounts
        const results = await edit(file_name,org_name,data);
        // console.log("index:",results)
        res.send(results);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching discounts');
      }
    } catch (err) {
      console.error(err);
      res.status(400).send('Invalid token');
    }
});

// Endpoint to airdrop given tokenIDs to given users
app.post('/brand/airdrop', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, secretKey);
    const users = req.body.users;
    const tokenIDs = req.body.tokenIDs;
    const amounts = req.body.amounts;
    console.log(users);
    try {
      const results = await airdrop(users, tokenIDs, amounts);
      res.send(results);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error while airdropping discounts');
    }
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid token');
  }
});
// Endpoint to fetch balance of a user
app.post('/user/balance', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
//   console.log(token);
  try {
    const decoded = jwt.verify(token, secretKey);
    const user = decoded.email;
    // 
    console.log(user);
    try {
      const results = await getBalance(user);
      console.log(results);
      const final_res=[];
      for (let i = 0; i < results.length; i++) {
        const Token = results[i].Token_data[results[i].tokenId];
        // console.log("TOKEN:",Token);
        if(Token===undefined){
          continue;
        }
        final_res.push({
          tokenId: results[i].tokenId,
          balance: results[i].balance,
          Token_data: Token,
        });
      }
      res.send(final_res);   
    } catch (err) {
      console.error(err);
      res.status(500).send('Error while fetching balance');
    }
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid token');
  }
});

app.post('/user/redeem', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, secretKey);
      const user = decoded.email;
      const tokenId = req.body.tokenId;
      const org_name = req.body.org_name;
        
        const result = await redeem(user, tokenId,org_name);
        if(result instanceof Error){
            res.status(400).send('Error while redeeming');
        }else{
            res.send(result);
        }

    } catch (err) {
      console.error(err);
      res.status(400).send('Invalid token');
    }
  });


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const httpsServer=https.createServer(cred,app);
httpsServer.listen(8443);

//
