var ethers = require("ethers");
require('dotenv').config({ path: '.env'});
const contractAddress = process.env.CONTRACT_ADDRESS
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const provider = new ethers.providers.JsonRpcProvider(host);
const abi = require("../Contract/Heycoin.json").abi;
const contract = new ethers.Contract(contractAddress, abi, provider);
const Pkey = "0x" + process.env.MEMBER_PRIVATE_KEY;
const wallet = new ethers.Wallet(Pkey, provider);
const createS3Campaign = require("../Database_scripts/Scripts/Campaign_creation");


//Data contains Organisation name and meta data for the token 
async function createCampaign(org_name,Campaign_name) {
    console.log("Creating Campaign...");
    try {
        await createS3Campaign('project-astra-bucket1',org_name, Campaign_name); 
        console.log("Campaign Created");
    } catch (err) {
        console.log(err);
        return; 
    }

}

// createCampaign('toysrus-nfts','campaign-test');

module.exports=createCampaign;