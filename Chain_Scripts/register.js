const {Web3} = require('web3');
const fs = require('fs');
const crypto = require('crypto');


// rpcnode details
// const { tessera, quorum } = require("../keys.js");
// const host = 'http://127.0.0.1:8545';
const host= 'http://43.205.140.72'
// Initialize a Quorum node's RPC endpoint
const web3 = new Web3(host); // Replace with your Quorum node's RPC endpoint

async function generateAccount(seed) {
    // Generate a 256-bit hash from the string
    const sha256Hash = crypto.createHash('sha256').update(seed).digest('hex');

    // Create an Ethereum account from the private key
    const account = await web3.eth.accounts.privateKeyToAccount('0x' + sha256Hash);
    // const account = await web3.eth.accounts.create();

    console.log(account);

    return account;
}

async function registerAccount(email, password) {
    // concatenate email and password
    const seed = email.concat(password);

    // generate account
    const account = await generateAccount(seed);

    // save account details in local json file
    // const accountDetails = {
    //     address: account.address,
    //     privateKey: account.privateKey
    // };
    // const fileName = 'accounts.json';
    // fs.appendFileSync(fileName, JSON.stringify(accountDetails) + '\n');
}

module.exports = registerAccount;

