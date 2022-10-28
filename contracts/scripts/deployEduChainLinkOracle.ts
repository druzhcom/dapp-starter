import { ethers } from "hardhat";
const { config } = require("../chainlink.config.js");

async function main() {
    const initialSupply = ethers.utils.parseEther("21000000000000");
    const [acc] = await ethers.getSigners();

    const LinkToken = await ethers.getContractFactory("LinkToken");
    const linkToken = await LinkToken.deploy();
    await linkToken.deployed();
    console.log(`LinkToken to ${linkToken.address}`);

    const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorMock");
    const vrfCoordinatorMock = await VRFCoordinatorMock.deploy(linkToken.address);
    await vrfCoordinatorMock.deployed();
    console.log(`VRFCoordinatorMock deployed to ${vrfCoordinatorMock.address}`);

    let linkTokenAddress = linkToken.address;
    let vrfCoordinatorAddress = vrfCoordinatorMock.address;

    const keyHash = config[31337].keyHash;
    const fee = config[31337].fee;

    const EduChainLinkOracle = await ethers.getContractFactory("EduChainLinkOracle");
    const eduCHOracle = await EduChainLinkOracle.deploy(vrfCoordinatorAddress,
        linkTokenAddress,
        keyHash,
        ethers.utils.parseUnits(fee, 18));

    await eduCHOracle.deployed();

    console.log(`Token deployed to ${eduCHOracle.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
