import {ethers} from "ethers";
import {getMetamaskProvider} from '../provider/provider'

export default function createContract() {
    const provider = getMetamaskProvider();
    const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    // Učitavanje ABI-ja smart contracta
    const contractABI = require('../../../hardhat/artifacts/contracts/Savings.sol/Savings.json').abi
    return new ethers.Contract(contractAddress, contractABI, provider)
}