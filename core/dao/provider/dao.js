import {getMetamaskProvider} from "./provider";

function accountsChangedCallback(accountChangedListener) {
    return () => {
        const provider = getMetamaskProvider();
        provider?.provider.on("accountsChanged", accountChangedListener);
        return () => {
            if (provider && provider.removeListener) {
                provider.provider.removeListener("accountsChanged", accountChangedListener);
            }
        };
    };
}

async function currentAddress() {
    const provider = getMetamaskProvider();
    const addresses = await provider.provider.request({method: "eth_requestAccounts"});
    return addresses[0]
}

export {currentAddress, accountsChangedCallback}
