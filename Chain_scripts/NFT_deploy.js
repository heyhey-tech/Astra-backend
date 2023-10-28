const path = require("path");
const fs = require("fs");
var ethers = require("ethers");

// rpcnode details
const { tessera, quorum } = require("../Contract/keys_copy.js");
const host = "http://43.205.140.72";

// abi and bytecode generated from simplestorage.sol:
const contractAbi = JSON.parse(
    fs.readFileSync('../Contract/DiscountToken.abi')
    );

  const contractBytecode = fs
    .readFileSync('../Contract/DiscountToken.bin').toString();
//   const contractAddress='0xcc4747b4ae57d9a0eb7a2fe0ad7fb8d9e98db51a';


async function createContract(
    provider,
    wallet,
    contractAbi,
    contractByteCode,
    baseURI,
    orgAddress
  ) {
    const factory = new ethers.ContractFactory(
      contractAbi,
      contractByteCode,
      wallet
    );
    const contract = await factory.deploy(baseURI, orgAddress);
    // The contract is NOT deployed yet; we must wait until it is mined
    const deployed = await contract.deployTransaction.wait();
    //The contract is deployed now
    return contract;
  }

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(host);
  const Pkey = quorum.member1.accountPrivateKey;
  console.log("Private Key of Deployer:", Pkey);
  const wallet = new ethers.Wallet(Pkey, provider);
  console.log("Deployer Address:", wallet.address);
  console.log("Deploying the contract...")

  const orgAddress = quorum.member1.accountAddress;


  const contract = await createContract(provider, wallet, contractAbi, contractBytecode, "baseURI", "Toysrus");
  console.log("Contract deployed at address: " + contract.address);
}

main();
