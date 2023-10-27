const { ethers } = require("ethers");

function generateHash(tokenId, senderAddress) {
    const abiCoder = new ethers.utils.AbiCoder();
    const encodedData = abiCoder.encode(['uint256', 'address'], [tokenId, senderAddress]);
    // const hash = ethers.utils.keccak256(encodedData);
    const generatedHash = ethers.utils.solidityKeccak256(['uint256', 'address'], [tokenId, senderAddress]);
    return generatedHash;
}

const tokenId = 3;
const senderAddress = '0x0fbdc686b912d7722dc86510934589e0aaf3b55a';
const generatedHash = generateHash(tokenId, senderAddress);
console.log(generatedHash);
// 0x561e4b2017ce2a8f27aff45ee69cd907aeab5574027154713129bd0b8555a516