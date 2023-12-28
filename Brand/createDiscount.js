const createS3Token = require("../Database_scripts/Scripts/NFT_new_creation");
var ethers = require("ethers");
require('dotenv').config({ path: '.env'});
const contractAddress = process.env.CONTRACT_ADDRESS
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const provider = new ethers.providers.JsonRpcProvider(host);
const abi = require("../Contract/Heycoin.json").abi;
const contract = new ethers.Contract(contractAddress, abi, provider);
const Pkey = "0x" + process.env.MEMBER_PRIVATE_KEY;
const wallet = new ethers.Wallet(Pkey, provider);
const contractWithSigner = contract.connect(wallet);


//Data contains Organisation name and meta data for the token 
async function CreateToken(org_name,data) {
    console.log("Creating token...");
    try {
        const res= await contractWithSigner.createToken({gasLimit: 1000000});
        // const res= await contractWithSigner.tokenIDCounter(1);
        console.log("Transaction hash:", res.hash);
    } catch (err) {
        console.log(err);
        return; 
    }
    try{
        await createS3Token('project-astra-bucket1',org_name, data); 


    }catch(err){
        console.log(err);
        return;
    }

}


module.exports=CreateToken;