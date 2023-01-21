import {ethers} from "ethers";

export function getDevProvider() {
    if (typeof window !== "undefined") {
        return new ethers.providers.JsonRpcProvider("http://localhost:8545");
    }
}

export function getMetamaskProvider() {
    if (typeof window !== "undefined") {
        return new ethers.providers.Web3Provider(window.ethereum, "any");
    }
}