import Web3 from 'web3'
import ganache from 'ganache'

let web3;
if (window) {
    web3 = new Web3(window.web3.currentProvider);
} else {
    web3 = new Web3(ganache.provider());
}

export default web3;
