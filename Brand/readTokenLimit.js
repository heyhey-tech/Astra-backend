const { ethers } = require('ethers');
const { get } = require('https');

// Connect to a provider (e.g., Infura, Alchemy, or your own Ethereum node)
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const provider = new ethers.providers.JsonRpcProvider(host);// Contract ABI and Address
const contractABI = require("../Contract/Heycoin.json").abi;
const contractAddress = "0xCeA7c81e6755f77EcB8de8a2538a68cbC9263597";
// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function getTokenLimit(index) {
    try {
        // Call the automatically generated getter for the mapping
        const value = await contract.tokenAirdropLimits(index);
      
        return value.toString();
    } catch (error) {
        console.error(error);
    }
}

getTokenLimit(1).then((value) => {
    console.log(value);
});




module.exports = getTokenLimit;
