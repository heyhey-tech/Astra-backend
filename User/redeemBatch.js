const { ethers } = require("hardhat");
var ethers = require("ethers");
require("dotenv").config({ path: "../.env" });

var queue = [];
var lastProcessedTime = Date.now();

async function redeemBatch(users, tokenIDs) {
    const contractAddress = "0xbCc6f30bD38Ea4859adf0ac4bA9E858240388034";
    const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
    const provider = new ethers.providers.JsonRpcProvider(host);
    const abi = require("../Contract/Heycoin.json").abi;
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const Pkey = "0x" + process.env.MEMBER_PRIVATE_KEY;
    const wallet = new ethers.Wallet(Pkey, provider);
    const contractWithSigner = contract.connect(wallet);
    const res = await contractWithSigner.redeemBatch(users, tokenIDs);
    await res.wait();
    return res.hash;
}

function addToQueue(userAddress, tokenId) {
    queue.push({ userAddress, tokenId });

    // Check if the queue size has reached 100
    if (queue.length >= 100) {
        //[+][+] Before processing the queue, remove duplicate calls and remove calls for tokens that 
        //[+][+] have already been redeemed/or have 0 balance and display error message for those calls
        processQueue();
    }
}

// Scheduled check every 5 seconds
setInterval(() => {
    if (Date.now() - lastProcessedTime >= 5000) {
        processQueue();
    }
}, 5000);

async function processQueue() {
    if (queue.length === 0) return;

    // Creating a copy of the queue and clearing the original queue
    const queueCopy = [...queue];
    queue = [];

    lastProcessedTime = Date.now();

    // Split queue copy into users and tokenIDs
    let users = queueCopy.map(item => item.userAddress);
    let tokenIDs = queueCopy.map(item => item.tokenId);

    try {
        const hash = await redeemBatch(users, tokenIDs);
        console.log('Batch processed:', hash);
    } catch (error) {
        console.error('Error processing batch:', error);
        // Implement retry logic or error handling as needed
        // Consider re-adding failed items to the queue or another structure for retry
    }
}

module.exports = addToQueue;
