require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { ACCOUNT_MNEMONIC, SEPOLIA_ENDPOINT } = process.env;

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        sepolia: {
            provider: () => new HDWalletProvider(ACCOUNT_MNEMONIC, SEPOLIA_ENDPOINT),
            network_id: '11155111',
            gas: 4465030
        }
    }
};
