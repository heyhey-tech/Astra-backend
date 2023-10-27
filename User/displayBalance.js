const path = require("path");
const fs = require("fs-extra");
var ethers = require("ethers");

// rpcnode details
const { tessera, quorum } = require("./keys_copy.js");
const host = quorum.validator1.url;
const accountAddress = quorum.rpcnode.accountAddress;


const abi = JSON.parse(
        fs.readFileSync('./Contract/DiscountToken.abi')
);
// add the deployed contract address here
const contractAddress = '0x68249ac64729F5e29f296ac0a670BDf9F6E6BeF9';


const provider = new ethers.providers.JsonRpcProvider(host);


const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider
);
async function getBalance(user) {
    const userPK = quorum.member3.accountPrivateKey;
    const wallet = new ethers.Wallet(userPK, provider);
    const contractWithSigner = contract.connect(wallet);
  
    const tokenIds = [];
    const balances = [];
  
    for (let j = 0; j < 100; j++) {
      try {
        const balance = await contractWithSigner.balanceOfBatch([user], [j]);
        if (balance.toString() !== '0') {
          tokenIds.push(j);
          balances.push(balance.toString());
        }
      } catch (err) {
        console.log(err);
        return [];
      }
    }
  
    const result = tokenIds.map((tokenId, index) => ({
      tokenId,
      balance: balances[index],
    }));
    return result;
  }


// async function main(){
//     const user = quorum.member3.accountAddress;
// const tokenIDs = [3,5,99];
//  const res= await getBalance(user);

//  console.log(res);

// }
// main();

module.exports = getBalance;