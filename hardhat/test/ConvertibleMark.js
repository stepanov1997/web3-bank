const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("ConvertibleMark", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneConvertibleMark() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ConvertibleMark = await ethers.getContractFactory("ConvertibleMark");
        const convertibleMark = await ConvertibleMark.deploy();

        return {convertibleMark, owner, otherAccount};
    }

    describe("Deployment", function () {
        it("Should be non-null value.", async function () {
            const {convertibleMark} = await loadFixture(deployOneConvertibleMark);
            expect(convertibleMark).to.not.be.an('undefined');
        });
    });
});
