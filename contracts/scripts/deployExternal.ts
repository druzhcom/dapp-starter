import { ethers } from "hardhat";

async function main() {
    const [acc] = await ethers.getSigners();

    const LinkToken = await ethers.getContractFactory("LinkToken");
    const linkToken = await LinkToken.deploy("LinkToken", {
        from: acc,
        log: true,

    });
    await linkToken.deployed();

    console.log(`LinkToken to ${linkToken.address}`);

    const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorMock");
    const vRFCoordinatorMock = await VRFCoordinatorMock.deploy({
        from: acc,
        log: true,
        args: [linkToken.address],
    });

    await vRFCoordinatorMock.deployed();

    console.log(`VRFCoordinatorMock deployed to ${vRFCoordinatorMock.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
