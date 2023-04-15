import {getMetamaskProvider} from "../provider/provider";
import createContract from "../savings/contract";
import {adaptNumber, fromAdaptedNumber} from "../../convertibleMarkParser";


function retrieveContract() {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    return contract.connect(signer)
}

export async function savings(address) {
    const contract = retrieveContract();
    return fromAdaptedNumber(await contract.savings(address));
}

export async function deposit(savingAmount) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);
    const transactionHash = await contract.deposit(adaptNumber(savingAmount), {
        gasLimit: 300000
    })
    return await provider.waitForTransaction(transactionHash.hash)
}

export async function withdraw(savingAmount) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);
    const transactionHash = await contract.withdraw(adaptNumber(savingAmount))
    return await provider.waitForTransaction(transactionHash.hash)
}

export async function getInterestedRate() {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);
    return Number(await contract.interestRate());
}

export async function pastDepositEvents(address) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);

    const filter = contract.filters.Deposit(null, address, null);
    return await contract.queryFilter(filter, 0, 'latest');
}

export async function pastWithdrawEvents(address) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);

    const filter = contract.filters.Withdraw(null, address, null);
    return await contract.queryFilter(filter, 0, 'latest');
}

export async function pastInterestEvents(address) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);

    const filter = contract.filters.Interest(null, address, null);
    return await contract.queryFilter(filter, 0, 'latest');
}