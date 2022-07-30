const { ethers, network } = require("hardhat")
const fs = require('fs')

const frontEndContractsFile = '../fcc-nft-full-stack-nextjs-morails/nft-marketplace/constants/networkMapping.json'

module.exports = async function() {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating Front_End...")

    await updateContractAddresses()
  }
}

async function updateContractAddresses() {
  const nftMarketplace = await ethers.getContract("NftMarketplace")
  const chainId = network.config.chainId.toString()
  const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, 'utf8'))

  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
      contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
    }
  } else {
    contractAddresses[chainId] = {"NftMarketplace": [nftMarketplace.address]}
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ['all', 'frontend']