import { ethers } from 'ethers';
import providerDao from "../providerDao";

const provider = providerDao.getProvider();

// Učitavanje ABI-ja smart contracta
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
const contractABI = require('../../hardhat/artifacts/contracts/ConvertibleMark.sol/ConvertibleMark').abi

export default new ethers.Contract(contractAddress, contractABI, provider)