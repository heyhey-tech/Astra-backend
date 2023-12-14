const { ethers } = require("hardhat");
var ethers = require("ethers");
require("dotenv").config({ path: "../.env" });

var queue = [];
var lastProcessedTime = Date.now();
const contractAddress = "0x678110884C85a68bB079Be062502DA4E6d004c68";
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const provider = new ethers.providers.JsonRpcProvider(host);
const abi = require("../Contract/Heycoin.json").abi;
const contract = new ethers.Contract(contractAddress, abi, provider);
const Pkey = "0x" + process.env.MEMBER_PRIVATE_KEY;
const wallet = new ethers.Wallet(Pkey, provider);
const contractWithSigner = contract.connect(wallet);

async function redeemBatch(users, tokenIDs) {
    const res = await contractWithSigner.redeemBatch(users, tokenIDs);
    await res.wait();
    return res.hash;
}

async function addToQueue(userAddress, tokenId) {
    // Check the balance of the token for the given user
    let balance = await contractWithSigner.balanceOf(userAddress, tokenId);
    if (balance === 0) {
        console.error(`You have already redeemed your Heycoin.`);
        return;
    }

    for (let i = 0; i < queue.length; i++) {
        if (queue[i].userAddress === userAddress && queue[i].tokenId === tokenId) {
            console.error(`Your Heycoin is being redeemed.`);
            return;
        }
    }

    queue.push({ userAddress, tokenId });

    // Check if the queue size has reached 100
    if (queue.length >= 100) {
        processQueue(queue);
        queue = [];
    }
}

// Scheduled check every 5 seconds
setInterval(() => {
    if (Date.now() - lastProcessedTime >= 5000) {
        processQueue(queue);
        queue = [];
    }
}, 5000);

async function processQueue(queue) {
    if (queue.length === 0) return;
    lastProcessedTime = Date.now();

    // Split queue copy into users and tokenIDs
    let users = queue.map(item => item.userAddress);
    let tokenIDs = queue.map(item => item.tokenId);

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
