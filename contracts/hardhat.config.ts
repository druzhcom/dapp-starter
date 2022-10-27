import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import * as dotenv from 'dotenv';
require("hardhat-deploy");
require("@appliedblockchain/chainlink-plugins-fund-link");

import './tasks/deploy';

dotenv.config();

const endpoint = process.env.INFURA_GOERLI_URL;
const etherscanKey = process.env.ETHERSCAN_KEY;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000
          }
        }
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.4.24",
      },
    ]
  },
  paths: {
    artifacts: '../frontend/src/artifacts'
  },
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 1000
      }
    },
    goerli: {
      url: endpoint || '',
      // chainId: 5,
      accounts:
        process.env.PRIVATE_KEY !== undefined
          ? [process.env.PRIVATE_KEY]
          : [],
      gas: 2100000,
      gasPrice: 8000000000,
      allowUnlimitedContractSize: true
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD'
  },
  etherscan: {
    apiKey: etherscanKey
  }
  // namedAccounts: {
  //   deployer: {
  //     default: 0,
  //     4: 0,
  //   },
  //   user2: {
  //     default: 1,
  //     4: 1,
  //   },
  //   user3: {
  //     default: 2,
  //     4: 2,
  //   },
},

export default config;
