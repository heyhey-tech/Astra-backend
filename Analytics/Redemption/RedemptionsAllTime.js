const ethers = require("ethers");
const contractAddress = "0x678110884C85a68bB079Be062502DA4E6d004c68";
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const provider = new ethers.providers.JsonRpcProvider(host);
const abi = require("../../Contract/Heycoin.json").abi;
const contract = new ethers.Contract(contractAddress, abi, provider);

/**
 * Fetch and aggregate AirdropSuccessful events from the smart contract.
 * @returns {Array} An array of sums of AirdropSuccessful events in 10 segments since the contract deployment.
 */
async function fetchAndAggregateRedemptions() {
    // Fetch events since the contract deployment
    const currentBlock = await provider.getBlockNumber();
    const deploymentBlock = 0x12a45; // The block number when the contract was deployed
    const totalBlocks = currentBlock - deploymentBlock;
    const segmentSize = Math.floor(totalBlocks / 10);

    // Define the time segments for aggregation
    const segments = [...Array(10)].map((_, i) => ({
        startBlock: deploymentBlock + i * segmentSize,
        endBlock: deploymentBlock + (i + 1) * segmentSize,
        sum: 0
    }));

    const eventName = 'DiscountRedeemed'; // Actual event name
    const filter = contract.filters[eventName](); // No filter by tokenId for AirdropSuccessful event

    // Iterate over segments and fetch events for each segment
    let totalRedemptions = 0;
    for (let segment of segments) {
        const events = await contract.queryFilter(filter, segment.startBlock, segment.endBlock);
        segment.sum = events.length; // Each event represents a single airdrop
        totalRedemptions += segment.sum;
    }

    console.log('Total number of redemptions:', totalRedemptions);
    const sum = segments.map(s => s.sum);
    console.log('Aggregated Redemption Data:', sum);
    // Return the aggregated sums and total number of airdrops
    return {
        sums: sum,
        total: totalRedemptions
    };
}

/**
 * The main handler for scheduled execution to fetch and aggregate AirdropSuccessful events.
 */
// async function scheduledFetchAndAggregate() {
//     try {
//         const { sums, total } = await fetchAndAggregateRedemptions();
//         console.log('Aggregated Redemption Data:', sums);
//         console.log('Total number of redemptions:', total);
//         // Further processing or storage of sums and total can be done here
//     } catch (error) {
//         console.error('Error fetching and aggregating airdrop events:', error);
//     }
// }

// // Example usage:
// scheduledFetchAndAggregate();

// Export the fetchAndAggregateAirdrops function if it needs to be used elsewhere
module.exports = fetchAndAggregateRedemptions;