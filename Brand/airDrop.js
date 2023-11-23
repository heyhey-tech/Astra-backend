const path = require("path");
const fs = require("fs-extra");
const createS3Token = require("../Database_scripts/Scripts/NFT_new_creation");
var ethers = require("ethers");
const getPasswordFromDB= require("../Database_scripts/Scripts/RDS/getPasswordFromDB");
const crypto = require('crypto');
const web3 = require('web3');
const checkUserInDB = require("../Database_scripts/Scripts/RDS/checkUserPresent");


// rpcnode details
const { tessera, quorum } = require("./keys_copy.js");
// for now, since we have just one org, we will hardcode these params
// later, we will fetch them from the DB
// const host = "http://43.205.140.72";
const host = "http://43.205.140.72";

const abi = JSON.parse(
    fs.readFileSync('./Contract/DiscountToken.abi')
);
// const bytecode = fs
//     .readFileSync('../Chain_scripts/output/DiscountToken.bin').toString();
const contractAddress = '0x00fFD3548725459255f1e78A61A07f1539Db0271';


const provider = new ethers.providers.JsonRpcProvider(host);


const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider
);


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
async function airdrop(emails,tokenIDs,amounts) {


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
        users.push(account.address);
    }

// This is the organisation private key, SInce there is only one demo org, we are hardcoding it
    const Pkey = quorum.member1.accountPrivateKey;


    const wallet = new ethers.Wallet(Pkey, provider);
    const contractWithSigner = contract.connect(wallet);

    console.log("Initiating airdrop...");
    try {

        const res= await contractWithSigner.airdropBatch(users, tokenIDs, amounts,{gasLimit: 1000000});
        console.log("Transaction hash:", res.hash);
        return res.hash;
    } catch (err) {
        console.log(err);
        return; 
    }
}

// const users=[quorum.member3.accountAddress,quorum.member2.accountAddress];
// const tokenIDs=[3,5];
// const amounts=[1,1];
// const emails=["hello@gmail.com"]

// airdrop(emails,[1,2],[1,2]);


module.exports=airdrop;