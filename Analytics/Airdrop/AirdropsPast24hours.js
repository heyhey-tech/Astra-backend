const ethers = require("ethers");
require('dotenv').config({ path: '.env'});
const contractAddress = process.env.CONTRACT_ADDRESS
const host = "http://a814b333b2aa8498f858d31160ffc39c-1657358876.ap-south-1.elb.amazonaws.com/rpc-1";
const provider = new ethers.providers.JsonRpcProvider(host);
const abi = require("../../Contract/Heycoin.json").abi;
const contract = new ethers.Contract(contractAddress, abi, provider);

/**
 * Fetch and aggregate AirdropSuccessful events from the smart contract.
 * @returns {Array} An array of sums of AirdropSuccessful events in 4-hour segments for the last 24 hours.
 */
async function fetchAndAggregateAirdrops(tokenId) {
    // Define the time segments for aggregation
    const now = new Date();
    const segments = [...Array(24)].map((_, i) => ({
        start: new Date(now - (24 - i) * 3600 * 1000),
        end: new Date(now - (23 - i) * 3600 * 1000),
        sum: 0
    }));

    // Fetch events from the past 24 hours
    const currentBlock = await provider.getBlockNumber();
    const filter = contract.filters.AirdropSuccessful(null, tokenId, null);
    const events = await contract.queryFilter(filter, currentBlock - 17280, currentBlock); // Assuming 5s block times

    // Iterate over events and aggregate them into the corresponding time segment
    for (let event of events) {
        const eventBlock = await provider.getBlock(event.blockNumber);
        const eventDate = new Date(eventBlock.timestamp * 1000);
        const segment = segments.find(s => eventDate >= s.start && eventDate < s.end);
        if (segment) {
            segment.sum += 1; // Each event represents a single airdrop
        }
    }

    // Return the aggregated sums
    return segments.map(s => s.sum);
}

/**
 * The main handler for scheduled execution to fetch and aggregate AirdropSuccessful events.
 */
async function scheduledFetchAndAggregate(tokenId) {
        try {
                const aggregatedData = await fetchAndAggregateAirdrops(tokenId);
                console.log('Aggregated Airdrop Data:', aggregatedData);
                // Further processing or storage of aggregatedData can be done here
        } catch (error) {
                console.error('Error fetching and aggregating airdrop events:', error);
        }
}

// Example usage:
scheduledFetchAndAggregate(1);

// Export the fetchAndAggregateAirdrops function if it needs to be used elsewhere
module.exports = fetchAndAggregateAirdrops;
