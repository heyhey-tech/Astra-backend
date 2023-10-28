const path = require("path");
const fs = require("fs-extra");
var ethers = require("ethers");
const readS3Data = require("../Database_scripts/Scripts/Data_read");
const getPasswordFromDB = require("../Database_scripts/Scripts/RDS/getPasswordFromDB");
const crypto = require('crypto');
const web3 = require('web3');
const checkUserInDB = require("../Database_scripts/Scripts/RDS/checkUserPresent");  

// rpcnode details
const { tessera, quorum } = require("./keys_copy.js");
const { error } = require("console");
// for now, since we have just one org, we will hardcode these params
// later, we will fetch them from the DB
// const host = "http://43.205.140.72";
const host = quorum.rpcnode.url;

const abi = JSON.parse(
    fs.readFileSync('../Contract/DiscountToken.abi')
);
// const bytecode = fs
//     .readFileSync('../Chain_scripts/output/DiscountToken.bin').toString();
const contractAddress = '0x68249ac64729F5e29f296ac0a670BDf9F6E6BeF9';


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
async function redeem(email, tokenID) {

    let password;
    try{
         const res= await checkUserInDB(email);
         if(res===false){
                console.log(email," not present in DB");
                throw new Error(email+" not present in DB");
         }
         password= await getPasswordFromDB(email);
    }catch(err){
        console.log(err);
        return err;
    }
    const seed = email.concat(password);
    const account = await generateAccount(seed);
    const Pkey = account.privateKey;
    // console.log(Pkey);

    readS3Data('project-astra-bucket1', tokenID, 'toysrus-nfts')
        .then((fileContent) => {
        // console.log(fileContent);
        if (fileContent[tokenID].isValid === 'false') {
            // console.log('Token Not Valid');
            throw new Error('Token Not Valid');
        }
        })
        .catch((err) => {
            // console.error(err);
            return err;
        });
    const wallet = new ethers.Wallet(Pkey, provider);
    const contractWithSigner = contract.connect(wallet);

    const senderAddress = account.address;    
    console.log(senderAddress);
    const hash = ethers.utils.solidityKeccak256(['uint256', 'address'], [tokenID, senderAddress]);
  
    try {
        const res = await contractWithSigner.redeemDiscount(tokenID, hash, { gasLimit: 1000000 });
        // console.log("Transaction hash:", res);

        return hash;
    } catch (err) {
        // console.log(err);
        return err;
    }
}
redeem('hello@gmail.com', 1);

module.exports = redeem;