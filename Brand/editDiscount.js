const fs = require("fs-extra");
const createS3Token = require("../Database_scripts/Scripts/NFT_new_creation");
const readAllS3Files = require("../Database_scripts/Scripts/Real_all_files");
var ethers = require("ethers");
const editS3Token = require("../Database_scripts/Scripts/Edit_token");



async function edit(file_name,org_name,data){
    try{
        await editS3Token('project-astra-bucket1',org_name,file_name, data); 


    }catch(err){
        console.log(err);
        return;
    }
    // edit the metadata of the given tokenID
}

module.exports = edit;


// data entries  