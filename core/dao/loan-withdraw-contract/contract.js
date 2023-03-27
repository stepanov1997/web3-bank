import {ethers} from "ethers";
import {getMetamaskProvider} from '../provider/provider'

export default function createContract() {
    const provider = getMetamaskProvider();
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    // Učitavanje ABI-ja smart contracta
    const contractABI = require('../../../hardhat/artifacts/contracts/LoanWithdraw.sol/LoanWithdraw.json').abi
    return new ethers.Contract(contractAddress, contractABI, provider)
}