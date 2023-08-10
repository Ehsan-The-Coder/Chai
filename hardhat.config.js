require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:
  {
    sepolia:
    {
      url: process.env.NETWORK_PROVIDER_INFURA_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY_METAMASK]
    }
  }
};
