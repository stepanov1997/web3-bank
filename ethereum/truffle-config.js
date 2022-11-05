require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { ACCOUNT_MNEMONIC, GOERLI_ENDPOINT } = process.env;

module.exports = {
  compilers: {
    solc: {
      version: "0.8.17",
      docker: true
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    goerli: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: ACCOUNT_MNEMONIC
        },
        providerOrUrl: GOERLI_ENDPOINT
      }),
      network_id: '5'
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './build/'
};
