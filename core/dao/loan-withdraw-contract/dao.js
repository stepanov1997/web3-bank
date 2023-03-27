import {getMetamaskProvider} from "../provider/provider";
import createContract from "../loan-withdraw-contract/contract";
import {fromAdaptedNumber} from "../../convertibleMarkParser";

export async function retrieveCollateralManagers() {
    const provider = getMetamaskProvider()
    const signer = provider.getSigner()
    let contract = createContract();
    contract = contract.connect(signer)
    // return fromAdaptedNumber(await contract.getCollateralManager())
}