const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const addVerifyCodeToRDS = require('./Scripts/addTemp.js');
const getCodeFromRDS = require('./Scripts/getCode.js');
const deleteRowsFromRDSTemp = require('./Scripts/removeTemp.js');
const addUserToRDS = require('./Scripts/add_client.js');
const checkUserInDB = require('./Scripts/checkUserPresent.js');
const getPasswordFromRDS = require('./Scripts/getPasswordFromTemp.js');
const getPasswordFromDB = require('./Scripts/getPasswordFromDB.js');
const checkBrandInDB = require('./Org_Scripts/checkBrandInDB.js');
const cors = require('cors');


const RPC_ENDPOINT= "http://43.205.140.72"
const Validator_1_ENDPOINT="http://3.110.181.88"
const Member_1_ENDPOINT="http://3.110.223.171"



// Load environment variables from .env file
dotenv.config();

app.use(cors({origin: '*'}));
// Use body-parser middleware to parse request body
app.use(bodyParser.json());

app.get('/', (req, res) => {res.json('my api running');});


app.post('/client/display_all', (req, res) => { ')

// // Endpoint to receive email address from user
// app.post('/user/register', async (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;

    
//     if (!isValidEmail(email)) {
//         return res.status(400).json({ error: 'Invalid email format' });
//     }
//     if (!isValidPassword(password)) {
//         return res.status(400).json({ error: 'Invalid password format' });
//     }

//     // await checkUserInDB(email).then((result) => {
//     //     if (result) {
//     //         return res.status(400).json({ error: 'User already exists' });
//     //     }});


//     const result=await checkUserInDB(email);
//     if (result) {
//         return res.status(400).json({ error: 'User already exists' });
//     }

//     // Send verification email
//     try {
//         const verificationCode = generateVerificationCode();

//         await sendVerificationEmail(email, verificationCode);
        
//         addVerifyCodeToRDS(email,verificationCode,password);

//         // Return success message
//         return res.status(200).json({ message: 'Verification email sent' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error while sending Verification mail' });
//     }

//     // TODO: Save email, password, verification code, and timestamp to temporary database
//     // If a record exists in the database with the same email address, update the record
// });



// // Endpoint to receive verification code from user
// app.post('/user/verify-code', (req, res) => {
//     const code = req.body.code;
//     const email = req.body.email;

//     // const password = req.body.password;


//     getCodeFromRDS(email)
//     .then((result) => {
//         if (code !== result) {
//                 return res.status(400).json({ error: 'Invalid verification code' });
//             }else{
//                 console.log("code is same as result");
//                 getPasswordFromRDS(email).then((password) => {
//                     addUserToRDS(email,email,password);
//                 }).catch((error) => {
//                     console.error(error);
//                     return res.status(500).json({ error: 'Internal server error while fetching password' });
//                 });


//                 deleteRowsFromRDSTemp(email)
//                 .then((affectedRows) => console.log(`${affectedRows} rows deleted from temp table`))
//                 .catch((error) => console.error(error));
//                 return res.status(200).json({ message: 'Verification code is correct, New User Registered' });
//                 }
//             }
//         )
//     .catch((error) => {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error while fetching verification code' });
//         }
//     )

// });



// app.post('/user/login', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     console.log("email:",email,"password:",password);

//     checkUserInDB(email).then((result) => {
//         console.log("result:",result);
//         if (result) {
//             getPasswordFromDB(email).then((result) => {
//                 if (result === password) {
//                     return res.status(200).json({ message: 'User Logged In' });
//                 }else{
//                     return res.status(400).json({ error: 'Invalid Password' });
//                 }
//             }).catch((error) => {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Internal server error while fetching password' });
//             });
//         }else{
//             return res.status(400).json({ error: 'User does not exist' });
//         }
//     }).catch((error) => {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error while checking user' });
//     });
// }
// );

// //Endpoint to start login from brands.
// app.post('/brand/login', async (req, res) => {
//     const email = req.body.email;

//     checkBrandInDB(email).then(async (result) => {
//         console.log("result:",result);
//         if (result){
//             try {
//                 const verificationCode = generateVerificationCode();
        
//                 await sendVerificationEmail(email, verificationCode);
                
//                 addVerifyCodeToRDS(email,verificationCode," ");
        
//                 // Return success message
//                 return res.status(200).json({ message: 'Verification email sent' });
//             } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Internal server error while sending Verification mail' });
//             }
//         }else{
//             return res.status(400).json({ error: 'Brand does not exist' });
//         }
//     }
//     ).catch((error) => {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error while checking brand' });
//     }
//     );  
// });

// //Endpoint to verify otp from brands.
// app.post('/brand/verify-code', (req, res) => {
//     const code = req.body.code;
//     const email = req.body.email;
//     getCodeFromRDS(email).then((result) => {
//         if (code !== result) {
//                 return res.status(400).json({ error: 'Invalid verification code' });
//             }
//             else{
//                 deleteRowsFromRDSTemp(email)
//                 .then((affectedRows) => console.log(`${affectedRows} rows deleted from temp table`))
//                 .catch((error) => console.error(error));
//                 return res.status(200).json({ message: 'Verification code is correct, Brand Logged In' });
//                 }
//             }
//         )
//     .catch((error) => {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error while fetching verification code' });
//         }
//     )
// });











// // Helper function to validate email format
// function isValidEmail(email) {
//     // Regular expression pattern for a valid email address
//     const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
  
//     // Test the email against the pattern
//     return emailPattern.test(email);
// }

// // Helper function to generate verification code
// function generateVerificationCode() {
//     // Generate random 6-digit code
//     return Math.floor(100000 + Math.random() * 900000);
//     // return 123456;
// }

// // password verification function
// function isValidPassword(password) {
//     // Regular expression pattern for a valid email address

//     const passwordPattern = /.{8,}/;
  
//     // Test the email against the pattern
//     return passwordPattern.test(password);
// }

// // Get email and password from environment variables
// const serviceEmail = process.env.EMAIL;
// const servicePass = process.env.PASS;

// // Helper function to send verification email
// function sendVerificationEmail(email, code) {
//     console.log(serviceEmail);
//     console.log(servicePass)
//     // Create nodemailer transporter
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: serviceEmail,
//             pass: servicePass
//         }
//     });

//     // Define email options
//     const mailOptions = {
//         from: serviceEmail,
//         to: email,
//         subject: 'Email Verification Code',
//         text: `Your verification code for Astra is ${code}`
//     };

//     // Send email
//     return transporter.sendMail(mailOptions);
// }

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

