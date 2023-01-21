import {ethers} from "ethers";
import {getMetamaskProvider} from '../provider/provider'

export default function createContract() {
    const provider = getMetamaskProvider();
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    // Učitavanje ABI-ja smart contracta
    const contractABI = require('../../../hardhat/artifacts/contracts/ConvertibleMark.sol/ConvertibleMark.json').abi
    return new ethers.Contract(contractAddress, contractABI, provider)
}