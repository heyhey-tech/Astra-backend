const path = require("path");
const fs = require("fs-extra");
const createS3Token = require("../Database_scripts/Scripts/NFT_new_creation");
var ethers = require("ethers");
const getPasswordFromDB= require("../Database_scripts/Scripts/RDS/getPasswordFromDB");
const crypto = require('crypto');
const web3 = require('web3');
const checkUserInDB = require("../Database_scripts/Scripts/RDS/checkUserPresent");
require('dotenv').config({ path: '.env'});
const contractAddress = process.env.CONTRACT_ADDRESS
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const provider = new ethers.providers.JsonRpcProvider(host);
const abi = require("../Contract/Heycoin.json").abi;
const contract = new ethers.Contract(contractAddress, abi, provider);
const Pkey = "0x" + process.env.MEMBER_PRIVATE_KEY;
const wallet = new ethers.Wallet(Pkey, provider);
const contractWithSigner = contract.connect(wallet);


async function generateAccount(seed) {
    // Generate a 256-bit hash from the string
    const sha256Hash = crypto.createHash('sha256').update(seed).digest('hex');

    // Create an Ethereum account from the private key
    const account = await web3.eth.accounts.privateKeyToAccount('0x' + sha256Hash);
    // const account = await web3.eth.accounts.create();

    console.log(account);

    return account;
}

//Data contains Organisation name and meta data for the token 
async function airdrop(emails,tokenID,amount) {
    const users=[];

    for (let i=0;i<emails.length;i++){
        const res= await checkUserInDB(emails[i]);
        if(res===false){
            console.log(emails[i]," not present in DB");
            continue;
        }
        const password= await getPasswordFromDB(emails[i]);
        const seed = emails[i].concat(password);
        const account = await generateAccount(seed);
        console.log("to addr:",account.address);

        users.push(account.address);
    }

    console.log("Initiating airdrop...");
    try {

        const res= await contractWithSigner.airdrop(users, tokenID, amount,{gasLimit: 1000000});
        console.log("Transaction hash:", res.hash);
        return res.hash;
    } catch (err) {
        console.log(err);
        return; 
    }
}



module.exports=airdrop;