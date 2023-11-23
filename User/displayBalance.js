const path = require("path");
const fs = require("fs-extra");
var ethers = require("ethers");
const getPasswordFromDB = require("../Database_scripts/Scripts/RDS/getPasswordFromDB");
const crypto = require('crypto');
const web3 = require('web3');
const checkUserInDB = require("../Database_scripts/Scripts/RDS/checkUserPresent");  
const readS3Data = require("../Database_scripts/Scripts/Data_read");

// rpcnode details
const { tessera, quorum } = require("./keys_copy.js");
const { read } = require("fs");
// const host = quorum.validator1.url;
const host= "http://43.205.140.72";
const accountAddress = quorum.rpcnode.accountAddress;


const abi = JSON.parse(
        fs.readFileSync('./Contract/DiscountToken.abi')
);
// add the deployed contract address here
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
    const userPK = quorum.member3.accountPrivateKey;
    const wallet = new ethers.Wallet(userPK, provider);
    const contractWithSigner = contract.connect(wallet);
  
    const tokenIds = [];
    const balances = [];
    const data=[];
  
    for (let j = 10; j < 25; j++) {
      try {
        console.log(j);
        const balance = await contractWithSigner.balanceOfBatch([user], [j]);
        // console.log(balance.toString());
        if (balance.toString() !== '0') {
        

          const res_data= await readS3Data('project-astra-bucket1', j, 'toysrus-nfts/');
          tokenIds.push(j);
          balances.push(balance.toString());
          console.log(res_data);
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
    
    // const Token_name = results[0].Token_data[results[0].tokenId].name;

    const result = tokenIds.map((tokenId, index) => ({
      tokenId,
      balance: balances[index],
      Token_data: data[index],
    }));
    return result;
  }


// async function main(){
//     const user = "hello@gmail.com";
// const tokenIDs = [1,2];
//  const res= await getBalance(user);

//  console.log(res);

// }
// main();

module.exports = getBalance;