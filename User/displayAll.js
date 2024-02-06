const path = require("path");
const fs = require("fs-extra");
const readAllS3Files = require("../Database_scripts/Scripts/Real_all_files");
var ethers = require("ethers");




async function fetchAllDiscounts(Organisation_Name) {

    const content =  await readAllS3Files(Organisation_Name);

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
module.exports = fetchAllDiscounts;