import {ethers} from "ethers";

function getDevProvider() {
    return new ethers.providers.JsonRpcProvider("http://localhost:8545");
}

function getProvider() {
    return getDevProvider();
}

export default { getProvider };