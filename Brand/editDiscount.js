const fs = require("fs-extra");
const createS3Token = require("../Database_scripts/Scripts/NFT_new_creation");
const readAllS3Files = require("../Database_scripts/Scripts/Real_all_files");
var ethers = require("ethers");
const editS3Token = require("../Database_scripts/Scripts/Edit_token");



async function edit(file_name,org_name,campaign_name,data){
    try{
        const res=await editS3Token('project-astra-bucket1',org_name,campaign_name,file_name, data); 
        // console.log(res);
        return res;

    }catch(err){
        console.log(err);
        return err;
    }
    // edit the metadata of the given tokenID
}

module.exports = edit;


// data entries  