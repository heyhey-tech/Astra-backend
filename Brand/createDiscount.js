const path = require("path");
const fs = require("fs-extra");
var ethers = require("ethers");

// rpcnode details
const { tessera, quorum } = require("./keys_copy.js");
// for now, since we have just one org, we will hardcode these params
// later, we will fetch them from the DB
const host = "http://43.205.140.72";

const abi = JSON.parse(
    fs.readFileSync('../Chain_scripts/output/DiscountToken.abi')
);
// const bytecode = fs
//     .readFileSync('../Chain_scripts/output/DiscountToken.bin').toString();
const contractAddress = '';


const provider = new ethers.providers.JsonRpcProvider(host);


const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider
);


async function CreateToken() {
    const Pkey = quorum.member1.accountPrivateKey;

    const wallet = new ethers.Wallet(Pkey, provider);
    const contractWithSigner = contract.connect(wallet);

    console.log("Creating token...");
    try {
        const res= await contractWithSigner.createToken({gasLimit: 1000000});
        console.log("Transaction hash:", res.hash);
    } catch (err) {
        console.log(err);
    }

}

module.exports=CreateToken;