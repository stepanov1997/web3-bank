import { ethers } from 'ethers';
import providerDao from "../providerDao";

const provider = providerDao.getMetamaskProvider();

// Učitavanje ABI-ja smart contracta
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const contractABI = require('../../hardhat/artifacts/contracts/ConvertibleMark.sol/ConvertibleMark').abi

export default new ethers.Contract(contractAddress, contractABI, provider)