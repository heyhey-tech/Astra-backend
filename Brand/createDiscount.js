const path = require("path");
const fs = require("fs-extra");
const createS3Token = require("../Database_scripts/Scripts/NFT_new_creation");
var ethers = require("ethers");


// rpcnode details
const { tessera, quorum } = require("./keys_copy.js");
// for now, since we have just one org, we will hardcode these params
// later, we will fetch them from the DB
// const host = "http://43.205.140.72";
const host = "http://43.205.140.72";

const abi = JSON.parse(
    fs.readFileSync('./Contract/DiscountToken.abi')
);
// const bytecode = fs
//     .readFileSync('../Chain_scripts/output/DiscountToken.bin').toString();
const contractAddress = '0x68249ac64729F5e29f296ac0a670BDf9F6E6BeF9';


const provider = new ethers.providers.JsonRpcProvider(host);


const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider
);

//Data contains Organisation name and meta data for the token 
async function CreateToken(org_name,data) {
    const Pkey = quorum.member1.accountPrivateKey;

    const wallet = new ethers.Wallet(Pkey, provider);
    const contractWithSigner = contract.connect(wallet);

    console.log("Creating token...");
    try {
        const res= await contractWithSigner.createToken({gasLimit: 1000000});
        console.log("Transaction hash:", res.hash);
    } catch (err) {
        console.log(err);
        return; 
    }
    try{
        await createS3Token('project-astra-bucket1',org_name, data); 


    }catch(err){
        console.log(err);
        return;
    }

}
// const pass_data={ org_name: 'toysrus-nfts/', 
//     data: { 
//         token_name: 'Toysrus',
//         token_symbol: 'TRU',
//         token_description: 'Toysrus',
//         token_image: 'https://www.toysrus.com/graphics/tru_prod_images/Disney-Pixar-Toy-Story-4-Bo-Peep-Action-Staff--pTRU1-32590364dt.jpg',
//         token_external_url: 'https://www.toysrus.com/graphics/tru_prod_images/Disney-Pixar-Toy-Story-4-Bo-Peep-Action-Staff--pTRU1-32590364dt.jpg',
//         token_animation_url: 'https://www.toysrus.com/graphics/tru_prod_images/Disney-Pixar-Toy-Story-4-Bo-Peep-Action-Staff--pTRU1-32590364dt.jpg',
//         token_background_color: '#FFFFFF',
//         token_attributes: [ 
//             { trait_type: 'Brand', value: 'Toysrus' },
//             { trait_type: 'Discount', value: '10%' },
//             { trait_type: 'Category', value: 'Toys' },
//             { trait_type: 'Expiry', value: '10/10/2021' } 
//         ] 
//     } 
// };

// CreateToken(pass_data);

module.exports=CreateToken;