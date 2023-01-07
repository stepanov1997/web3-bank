import {ethers} from "ethers";

function getDevProvider() {
    if (typeof window !== "undefined") {
        return new ethers.providers.JsonRpcProvider("http://localhost:8545");
    }
}

function getMetamaskProvider() {
    if (typeof window !== "undefined") {
        return new ethers.providers.Web3Provider(window.ethereum, "any");
    }
}

export default { getDevProvider, getMetamaskProvider };