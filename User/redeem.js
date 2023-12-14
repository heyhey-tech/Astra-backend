const path = require("path");
const fs = require("fs-extra");
var ethers = require("ethers");
const readS3Data = require("../Database_scripts/Scripts/Data_read");
const getPasswordFromDB = require("../Database_scripts/Scripts/RDS/getPasswordFromDB");
const crypto = require('crypto');
const web3 = require('web3');
const checkUserInDB = require("../Database_scripts/Scripts/RDS/checkUserPresent");  
const readCoupon = require("../Database_scripts/Scripts/Fetch_Coupon_Code");

const { error } = require("console");
const contractAddress = "0x678110884C85a68bB079Be062502DA4E6d004c68";
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const provider = new ethers.providers.JsonRpcProvider(host);
const abi = require("../Contract/Heycoin.json").abi;
const contract = new ethers.Contract(contractAddress, abi, provider);


async function generateAccount(seed) {
    // Generate a 256-bit hash from the string
    const sha256Hash = crypto.createHash('sha256').update(seed).digest('hex');

    // Create an Ethereum account from the private key
    const account = await web3.eth.accounts.privateKeyToAccount('0x' + sha256Hash);
    // const account = await web3.eth.accounts.create();

    // console.log(account);

    return account;
}

//Data contains Organisation name and meta data for the token 
async function redeem(email, tokenID, org_name) {

    let password;
    try{
         const res= await checkUserInDB(email);
         if(res===false){
                console.log(email," not present in DB");
                return new Error(email+" not present in DB");
         }
         password= await getPasswordFromDB(email);
    }catch(err){
        console.log(err);
        return err;
    }
    const seed = email.concat(password);
    const account = await generateAccount(seed);
    const Pkey = account.privateKey;
    const Folder_name=org_name.concat('/');

    try {
        const fileContent = await readS3Data('project-astra-bucket1', tokenID, Folder_name);
        if (fileContent[tokenID].isValid === 'false') {
            console.log("token not valid");
            return new Error('Token Not Valid');
        }else{
            const wallet = new ethers.Wallet(Pkey, provider);
            const contractWithSigner = contract.connect(wallet);
        
            // const senderAddress = account.address;    
            // const hash = ethers.utils.solidityKeccak256(['uint256', 'address'], [tokenID, senderAddress]);
            
            try {
                const coupon = await readCoupon('project-astra-bucket1');
                const res = await contractWithSigner.redeem(tokenID, { gasLimit: 1000000 });
                // console.log("Transaction hash:", res);
                // console.log(res);
                
                return coupon;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    } catch (err) {
        console.log("returning error:",err);
        return err;
    }

}
// redeem('hello@gmail.com', 1);

module.exports = redeem;