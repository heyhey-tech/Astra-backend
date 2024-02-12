const path = require("path");
const fs = require("fs-extra");
const createS3Token = require("../Database_scripts/Scripts/NFT_new_creation");
const readAllS3Folders= require("../Database_scripts/Scripts/Read_Folders");
var ethers = require("ethers");




async function fetchAllCampaigns(Organisation_Name) {

    const content =  await readAllS3Folders(Organisation_Name);

    // console.log(content);
    return content;


}

// async function main() {
//     const org_name = "toysrus-nfts";
//     const content = await fetchAllDiscounts(org_name);
//     const tokenid=2;
//     console.log(content[tokenid.toString()])
//   }
// main();
module.exports = fetchAllCampaigns;