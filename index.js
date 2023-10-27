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


const RPC_ENDPOINT= "http://43.205.140.72"
const Validator_1_ENDPOINT="http://3.110.181.88"
const Member_1_ENDPOINT="http://3.110.223.171"



// Load environment variables from .env file
dotenv.config();

app.use(cors({origin: '*'}));
// Use body-parser middleware to parse request body
app.use(bodyParser.json());

app.get('/', (req, res) => {res.json('my api running');});

// Endpoint to create a Discount by a Brand
app.post('/brand/createToken', async (req, res) => {
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
});

// Endpoint to fetch all the discounts
app.get('/brand/display-all', async (req, res) => {
    const org_name=req.body.org_name;
    // console.log(org_name);
    try {
        // should return a json of the metadata of all the discounts
        const results = await fetchAllDiscounts(org_name);
        // console.log(results);
        res.send(results);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching discounts');
      }
});

// Endpoint to edit the metadata of a discount with a given id
app.post('/brand/edit-discount', async (req, res) => {
    const file_name = req.body.token_id;
    const org_name = req.body.org_name;
    const data= req.body.data;
    try {
        // should return a json of the metadata of all the discounts
        const results = await edit(file_name,org_name,data);
        res.send(results);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching discounts');
      }
});

// Endpoint to airdrop given tokenIDs to given users
app.post('/brand/airdrop', async (req, res) => {
  const users = req.body.users;
  const tokenIDs = req.body.tokenIDs;
  const amounts = req.body.amounts;
  console.log(users);
  try {
      const results = await airdrop(users,tokenIDs,amounts);
      res.send(results);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error while airdroping discounts');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

