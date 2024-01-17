const ethers = require("ethers");
require('dotenv').config({ path: '.env'});
const contractAddress = process.env.CONTRACT_ADDRESS
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const getPasswordFromDB = require("../Database_scripts/Scripts/RDS/getPasswordFromDB");
const { access } = require("fs-extra");
const checkUserInDB = require("../Database_scripts/Scripts/RDS/checkUserPresent");  
const crypto = require('crypto');
const web3 = require('web3');
const readS3Data = require("../Database_scripts/Scripts/Data_read");




const provider = new ethers.providers.JsonRpcProvider(host);
const abi = require("../Contract/Heycoin.json").abi;
const contract = new ethers.Contract(contractAddress, abi, provider);

/**
 * Fetch and aggregate AirdropSuccessful events from the smart contract.
 * @returns {Array} An array of sums of AirdropSuccessful events in 10 segments since the contract deployment.
 */

async function generateAccount(seed) {
    // Generate a 256-bit hash from the string
    const sha256Hash = crypto.createHash('sha256').update(seed).digest('hex');

    // Create an Ethereum account from the private key
    const account = await web3.eth.accounts.privateKeyToAccount('0x' + sha256Hash);
    // const account = await web3.eth.accounts.create();

    // console.log(account);

    return account;
}

async function fetchRedeemedDiscounts(email) {
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
    const accountAddress = account.address;
  
    // Fetch events since the contract deployment
    const currentBlock = await provider.getBlockNumber();
    const deploymentBlock = parseInt(process.env.DEPLOYMENT_BLOCK); // The block number when the contract was deployed
    const totalBlocks = currentBlock - deploymentBlock;
    const segmentSize = Math.floor(totalBlocks / 10);

    // Define the time segments for aggregation
    const segments = [...Array(10)].map((_, i) => ({
        startBlock: deploymentBlock + i * segmentSize,
        endBlock: deploymentBlock + (i + 1) * segmentSize,
        sum: 0
    }));

    const filter = contract.filters.DiscountRedeemed(accountAddress, null, null);

    // Iterate over segments and fetch events for each segment
    const data=[];
    const tokenIds = [];


    for (let segment of segments) {
        const events = await contract.queryFilter(filter, segment.startBlock, segment.endBlock);
        //iterate over events
        for(let event of events){
            const tokenID = event.args.tokenId;
            const tokenID_int = parseInt(tokenID);
            //if tokenID is not present in tokenIds array

            if(!tokenIds.includes(tokenID_int)){
            tokenIds.push(tokenID_int);
            const res_data= await readS3Data('project-astra-bucket1', tokenID_int, 'toysrus-nfts/');
            // console.log("data:",res_data)
            data.push(res_data[tokenID_int.toString()]); 
            }else{
                console.log("tokenID already present")
            }

        }

    }

    const result = tokenIds.map((tokenId, index) => ({
        tokenId,
        Token_data: data[index],
      }));
      return data;
      



}

/**
 * The main handler for scheduled execution to fetch and aggregate AirdropSuccessful events.
//  */
async function scheduledFetchAndAggregate(email) {

    try {
        const res= await fetchRedeemedDiscounts(email);
        console.log("RESULT:",res);
        // Further processing or storage of sums and total can be done here
    } catch (error) {
        console.error('Error fetching and aggregating airdrop events:', error);
    }
}

// // Example usage:
scheduledFetchAndAggregate("caleb.franklin@gmail.com");

// Export the fetchAndAggregateAirdrops function if it needs to be used elsewhere
module.exports = fetchRedeemedDiscounts;