const path = require("path");
const fs = require("fs-extra");
var ethers = require("ethers");
const getPasswordFromDB = require("../Database_scripts/Scripts/RDS/getPasswordFromDB");
const crypto = require('crypto');
const web3 = require('web3');
const checkUserInDB = require("../Database_scripts/Scripts/RDS/checkUserPresent");  
const readS3Data = require("../Database_scripts/Scripts/Data_read");
const fetchAllDiscounts=require("./displayAll");
require('dotenv').config({ path: '.env'});
const contractAddress = process.env.CONTRACT_ADDRESS
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const provider = new ethers.providers.JsonRpcProvider(host);
const abi = require("../Contract/Heycoin.json").abi;
const contract = new ethers.Contract(contractAddress, abi, provider);
const Pkey = "0x" + process.env.MEMBER_PRIVATE_KEY;
const wallet = new ethers.Wallet(Pkey, provider);
const contractWithSigner = contract.connect(wallet);

// async function reset(){
//   const res=await contractWithSigner.tokenIdCounter(1);
//   console.log(res.toString());
// }
async function generateAccount(seed) {
  // Generate a 256-bit hash from the string
  const sha256Hash = crypto.createHash('sha256').update(seed).digest('hex');

  // Create an Ethereum account from the private key
  const account = await web3.eth.accounts.privateKeyToAccount('0x' + sha256Hash);
  // const account = await web3.eth.accounts.create();

  console.log(account);

  return account;
}


function getTokenData(data, tokenId) {
  // Find the object with the matching tokenId
  const tokenObject = data.find(item => item.tokenId === tokenId);

  // If no matching object is found, return null
  if (!tokenObject) {
    return null;
  }

  // Return the Token_data for the matching tokenId
  return tokenObject.Token_data[tokenId.toString()];
}
// const tokenData = getTokenData(data, tokenId);


async function getBalance(email) {
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
    const user = account.address;
    const tokenIds = [];
    const balances = [];
    const data=[];
  

    const org_name = "toysrus-nfts";
    const content = await fetchAllDiscounts(org_name);


    const contentLength = Object.keys(content).length;
    console.log("Length of content:", contentLength);

    const keys= Object.keys(content);
    console.log("Keys:",keys);


    for (let j = 1; j <= contentLength; j++) {
      try {
        const tokenID =keys[j-1];
        
        const balance = await contractWithSigner.balanceOfBatch([user], [tokenID]);
        console.log("Balance for token id:",tokenID,"->",balance.toString());
        if (balance.toString() !== '0') {
          const res_data= content[tokenID.toString()]
          tokenIds.push(tokenID.toString());
          balances.push(balance.toString());
          // console.log(res_data); 
          data.push(res_data); 
        }
      } catch (err) {
        if(err==="The specified key does not exist."){
          continue;
        }else{
          console.log("ERR:",err);
          return [];
        }
      
      }
    }
    

  

    const result = tokenIds.map((tokenId, index) => ({
      tokenId,
      balance: balances[index],
      Token_data: data[index],
    }));

    return result;
  }




// async function main(){


// }
// main();

module.exports = getBalance;