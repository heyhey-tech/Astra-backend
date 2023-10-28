const path = require("path");
const fs = require("fs-extra");
const createS3Token = require("../Database_scripts/Scripts/NFT_new_creation");
var ethers = require("ethers");


// rpcnode details
const { tessera, quorum } = require("./keys_copy.js");
// for now, since we have just one org, we will hardcode these params
// later, we will fetch them from the DB
// const host = "http://43.205.140.72";
const host = quorum.rpcnode.url;

const abi = JSON.parse(
    fs.readFileSync('./Contract/DiscountToken.abi')
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

//Data contains Organisation name and meta data for the token 
async function airdrop(users,tokenIDs,amounts) {
    const Pkey = quorum.member1.accountPrivateKey;

    const wallet = new ethers.Wallet(Pkey, provider);
    const contractWithSigner = contract.connect(wallet);

    console.log("Initiating airdrop...");
    try {

        const res= await contractWithSigner.airdropBatch(users, tokenIDs, amounts,{gasLimit: 1000000});
        console.log("Transaction hash:", res.hash);
    } catch (err) {
        console.log(err);
        return; 
    }
}

// const users=[quorum.member3.accountAddress,quorum.member2.accountAddress];
// const tokenIDs=[3,5];
// const amounts=[1,1];

// airdrop(users,tokenIDs,amounts);


module.exports=airdrop;