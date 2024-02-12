const createS3Token = require("../Database_scripts/Scripts/NFT_new_creation");
const getTokenCounter=require("./readTokenCounter");
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
async function CreateToken(org_name,campaign_name,data) {
    console.log("Creating token...");
    var token_id;
    try {
        const limit = 1000;

        const res= await contractWithSigner.createToken(limit,{gasLimit: 1000000});
        await res.wait();
        token_id = await getTokenCounter();
        token_id=token_id-1;
        console.log("Token Id created:",token_id);
       
    } catch (err) {
        console.log(err);
        return; 
    }
    try{
        await createS3Token('project-astra-bucket1',org_name,campaign_name,token_id,data); 


    }catch(err){
        console.log(err);
        return;
    }

}

// CreateToken('toysrus-nfts','test_campaign','slkdfj');

module.exports=CreateToken;