import createContract from "./contract";
import {adaptNumber, fromAdaptedNumber} from "../../convertibleMarkParser";
import {getMetamaskProvider} from "../provider/provider";

export async function sendTransaction(receiverAddress, receiverAmount ) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);
    const transactionHash = await contract.transfer(receiverAddress, adaptNumber(receiverAmount));
    return await provider.waitForTransaction(transactionHash.hash)
}

export async function mint(address, mintAmount) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);
    const transactionHash = await contract.mint(address, adaptNumber(mintAmount));
    return await provider.waitForTransaction(transactionHash.hash)
}

export async function balanceOf(address) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer)
    return fromAdaptedNumber(await contract.balanceOf(address))
}

export async function pastEvents(address) {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer);

    const filterFrom = contract.filters.Transfer(address, null);
    const filterTo = contract.filters.Transfer(null, address);

    const eventsFrom = await contract.queryFilter(filterFrom, 0, 'latest');
    const eventsTo = await contract.queryFilter(filterTo, 0, 'latest');

    for (const event of eventsFrom) {
        event.type = 'sender'
    }
    for (const event of eventsTo) {
        event.type = 'receiver'
    }
    return eventsFrom.concat(eventsTo);
}