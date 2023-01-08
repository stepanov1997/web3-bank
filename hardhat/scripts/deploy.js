// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contractDao, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');
const path = require("path")

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

    const lockedAmount = hre.ethers.utils.parseEther("1");
    const contractFiles = fs.readdirSync('./contracts');

    // Iterate over the array of file names
    for (const file of contractFiles) {
        // Import the contract artifact object
        const contractArtifact = require(`../artifacts/contracts/${file}/${path.basename(file, path.extname(file))}.json`);
        // Get the contract factory
        const contractFactory = await hre.ethers.getContractFactory(contractArtifact.contractName);
        // Deploy the contract
        let contract = undefined
        if (contractArtifact.abi[0].stateMutability === 'nonpayable') {
            contract = await contractFactory.deploy();
        } else {
            contract = await contractFactory.deploy(unlockTime, { value: lockedAmount });
        }

        // Wait for the contract to be deployed
        await contract.deployed();
        console.log(`${contractArtifact.contractName} deployed at ${contract.address}`);

        console.log(
            `Contract with 1 ETH and unlock timestamp ${unlockTime} deployed to ${contract.address}`
        );
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
