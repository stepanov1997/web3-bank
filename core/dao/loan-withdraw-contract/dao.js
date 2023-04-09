import {getMetamaskProvider} from "../provider/provider";
import createContract from "../loan-withdraw-contract/contract";

function retrieveContract() {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    return contract.connect(signer)
}

export async function getLtvRatio() {
    const contract = retrieveContract();
    return Number(await contract.LTV());
}

export async function convertEthsToKm(value) {
    const contract = retrieveContract();
    return Number(await contract.convertEthsToConvertibleMarks(value));
}

export async function convertKmsToEth(value) {
    const contract = retrieveContract();
    return Number(await contract.convertConvertibleMarksToEths(value));
}

export async function getLoan(address) {
    const contract = retrieveContract();
    return Number(await contract.loans(address));
}

export async function getCollateral(address) {
    const contract = retrieveContract();
    return Number(await contract.collateral(address));
}

export async function lend(loanAmount, collateralAmount) {
    const contract = retrieveContract();
    await contract.lend(loanAmount, { value: collateralAmount, gasLimit: 30000000 });
}