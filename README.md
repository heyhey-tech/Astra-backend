# Astra Backend

This is the backend API server for the Astra application. It provides endpoints for verifying email addresses using a verification code.

## Getting Started

To get started with the API server, follow these steps:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/username/Astra-backend.git
    ```

2. Install the dependencies using npm:

    ```bash
    cd Astra-backend
    npm install
    ```

3. Create a `.env` file in the root directory of the project and add the following environment variables:

    ```env
    EMAIL=your_email_address
    PASS=your_email_password
    PORT=3000
    ```

   Replace `your_email_address` and `your_email_password` with your email address and password. The `PORT` variable is optional and defaults to 3000 if not set.

4. Start the API server

    ```bash
    npm start
    ```

   The server should now be running on [http://localhost:3000](http://localhost:3000).

## API Endpoints

The API server provides the following endpoints:

### POST /verify-email

This endpoint receives an email address and password in the request body and sends a verification email to the address. The email contains a verification code that the user must enter to verify their email address.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "userPassword"
}
```

**Response**

- 200 OK if the email was sent successfully.
- 400 Bad Request if the email address is invalid.
- 500 Internal Server Error if there was an error while sending the email.

### POST /verify-code
This endpoint receives a verification code in the request body and compares it with the code sent in the verification email. If the codes match, the email address is considered verified, the user is considered registered and the email and password are saved in the database.

**Request Body;**

```json
{
  "code": "123456"
}
```

**Response**
- 200 OK if the verification code is correct.
- 400 Bad Request if the verification code is incorrect.

### Dependencies
The API server uses the following dependencies:

- express: A web framework for Node.js.
- nodemailer: A module for sending emails from Node.js.
- body-parser: A middleware for parsing request bodies.
- dotenv: A module for loading environment variables from a .env file.

### License
This project is licensed under the MIT License. See the LICENSE file for details.