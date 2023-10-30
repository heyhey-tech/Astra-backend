const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const CreateToken = require('./Brand/createDiscount');
const fetchAllDiscounts = require('./Brand/displayAll');
const edit = require('./Brand/editDiscount');
const cors = require('cors');
const airdrop = require('./Brand/airDrop');
const getBalance = require('./User/displayBalance');
const redeem = require('./User/redeem');
const jwt = require('jsonwebtoken');
const { errorMonitor } = require('nodemailer/lib/xoauth2');
const secretKey = 'secret-key';

const RPC_ENDPOINT= "http://43.205.140.72"
const Validator_1_ENDPOINT="http://3.110.181.88"
const Member_1_ENDPOINT="http://3.110.223.171"



// Load environment variables from .env file
dotenv.config();

app.use(cors({origin: '*'}));
// Use body-parser middleware to parse request body
app.use(bodyParser.json());

app.get('/', (req, res) => {res.json('my api running');});

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
      res.status(401).send('Invalid token');
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
      res.status(401).send('Invalid token');
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
    res.status(401).send('Invalid token');
  }
});
// Endpoint to fetch balance of a user
app.post('/user/balance', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
//   console.log(token);
  try {
    const decoded = jwt.verify(token, secretKey);
    const user = decoded.email;
    // console.log(user);
    try {
      const results = await getBalance(user);
      res.send(results);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error while fetching balance');
    }
  } catch (err) {
    console.error(err);
    res.status(401).send('Invalid token');
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
            res.status(401).send('Error while redeeming');
        }else{
            res.send(result);
        }

    } catch (err) {
      console.error(err);
      res.status(401).send('Invalid token');
    }
  });


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

