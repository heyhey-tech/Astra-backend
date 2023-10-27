const path = require("path");
const fs = require("fs-extra");
var ethers = require("ethers");
const readS3Data = require("../Database_scripts/Scripts/Data_read");


// rpcnode details
const { tessera, quorum } = require("./keys_copy.js");
const { error } = require("console");
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
async function redeem(Pkey, tokenID) {

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

    const senderAddress = quorum.member3.accountAddress;    
    // console.log(senderAddress);
    const hash = ethers.utils.solidityKeccak256(['uint256', 'address'], [tokenID, senderAddress]);
    // console.log("hash:",hash);
    // console.log("Authenticating Coupon...");
    try {
        const res = await contractWithSigner.redeemDiscount(tokenID, hash, { gasLimit: 1000000 });
        // console.log("Transaction hash:", res);

        return hash;
    } catch (err) {
        // console.log(err);
        return err;
    }
}
// redeem(quorum.member3.accountPrivateKey, 5);

module.exports = redeem;