const hre = require("hardhat");

async function main() 
{
    const Chai=await hre.ethers.getContractFactory("Chai");
    const chai= await Chai.deploy();
    await chai.deployed();
    console.log("Chai contract is deployed to sepolia test net:",chai.address);
    //contract deployed to sepolia network id is  0x54C7490117bdA8E940896b7d3057c7bf546785C1
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
