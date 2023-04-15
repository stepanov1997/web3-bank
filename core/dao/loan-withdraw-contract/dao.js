import {getMetamaskProvider} from "../provider/provider";
import createContract from "../loan-withdraw-contract/contract";
import {adaptNumber, fromAdaptedNumber} from "../../convertibleMarkParser";

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
    return fromAdaptedNumber(await contract.convertEthsToConvertibleMarks(value));
}

export async function convertKmsToEth(value) {
    const contract = retrieveContract();
    return fromAdaptedNumber(await contract.convertConvertibleMarksToEths(value));
}

export async function getLoan(address) {
    const contract = retrieveContract();
    return fromAdaptedNumber(await contract.loans(address));
}

export async function getInterestRate() {
    const contract = retrieveContract();
    return Number(await contract.interestRate());
}

export async function getCollateral(address) {
    const contract = retrieveContract();
    return fromAdaptedNumber(await contract.collateral(address));
}

export async function repay(amount) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);
    const transactionHash = await contract.repay(adaptNumber(amount), {
        gasLimit: 300000
    });
    return await provider.waitForTransaction(transactionHash.hash)
}

export async function lend(loanAmount, collateralAmount) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);
    const transactionHash = await contract.lend(adaptNumber(loanAmount), {
        value: adaptNumber(collateralAmount),
        // gasLimit: 30000000
    });
    return await provider.waitForTransaction(transactionHash.hash)
}

export async function pastLendEvents(address) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);

    const filter = contract.filters.Lend(null, address, null, null);
    return await contract.queryFilter(filter, 0, 'latest');
}

export async function pastLiquidateEvents(address) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);

    const filter = contract.filters.Liquidate(null, null, address, null);
    return await contract.queryFilter(filter, 0, 'latest');
}

export async function pastRepayEvents(address) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);

    const filter = contract.filters.Repay(null, address, null, null);
    return await contract.queryFilter(filter, 0, 'latest');
}