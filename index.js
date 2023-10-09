const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();

// Load environment variables from .env file
dotenv.config();

// Use body-parser middleware to parse request body
app.use(bodyParser.json());

// Endpoint to receive email address from user
app.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send verification email
    try {
        const verificationCode = generateVerificationCode();
        await sendVerificationEmail(email, verificationCode);

        // Return success message
        return res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error while sending Verification mail' });
    }

    // TODO: Save email, password, verification code, and timestamp to temporary database
    // If a record exists in the database with the same email address, update the record
});

// Endpoint to receive verification code from user
app.post('/verify-code', (req, res) => {
    const code = req.body.code;

    // Compare verification code with code sent in email
    if (code !== 123456) {
    // if (code !== verificationCode) {
        return res.status(400).json({ error: 'Invalid verification code' });
    }

    // TODO: Move the email, password, and timestamp from temporary database to permanent database

    // Return success message
    return res.status(200).json({ message: 'Email verified and user Registered!' });
});

// Helper function to validate email format
function isValidEmail(email) {
    // Regular expression pattern for a valid email address
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Test the email against the pattern
    return emailPattern.test(email);
}

// Helper function to generate verification code
function generateVerificationCode() {
    // Generate random 6-digit code
    // return Math.floor(100000 + Math.random() * 900000);
    return 123456;
}

// Get email and password from environment variables
const serviceEmail = process.env.EMAIL;
const servicePass = process.env.PASS;

// Helper function to send verification email
function sendVerificationEmail(email, code) {
    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: serviceEmail,
            pass: servicePass
        }
    });

    // Define email options
    const mailOptions = {
        from: serviceEmail,
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code for Astra is ${code}`
    };

    // Send email
    return transporter.sendMail(mailOptions);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});