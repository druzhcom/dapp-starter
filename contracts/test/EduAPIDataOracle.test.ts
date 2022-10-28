const { expect } = require("chai");
const { ethers, getChainId, deployments } = require("hardhat");
const { config, autoFundCheck } = require("../chainlink.config.js");
import { ethers as Ethers } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';


declare var hre: any


describe("EduChainLinkOracle Tests", () => {
    let EduChainLinkOracle;
    let eduChainLinkOracle: any;
    let VRFCoordinatorMock;
    let vrfCoordinatorMock
    let LinkToken;
    let linkToken: any;
    let chainId = 31337; // TODO

    // const DAY = 3600 * 24;
    let account1: Ethers.Signer;
    let account2: Ethers.Signer;

    before(async function () {
        const [acc1, acc2] = await ethers.getSigners();

        account1 = acc1;
        account2 = acc2;

        LinkToken = await ethers.getContractFactory("LinkToken");
        linkToken = await LinkToken.deploy();
        await linkToken.deployed();
        console.log(`LinkToken to ${linkToken.address}`);

        VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorMock");
        vrfCoordinatorMock = await VRFCoordinatorMock.deploy(linkToken.address);
        await vrfCoordinatorMock.deployed();
        console.log(`VRFCoordinatorMock deployed to ${vrfCoordinatorMock.address}`);

        EduChainLinkOracle = await ethers.getContractFactory("EduAPIDataOracle");
        eduChainLinkOracle = await EduChainLinkOracle.deploy();
        console.log("EduVRFOracle address: ", eduChainLinkOracle.address);
    })

    it("Should Request Random", async () => {
        let fundTx = await hre.run("fund-link", {
            contract: eduChainLinkOracle.address,
            linkaddress: linkToken.address,
        });

        // await fundTx.wait();

        const rquestTx = await eduChainLinkOracle.requestVolumeData();
        const receiptCrquestTx = await rquestTx.wait();
        console.log("txReceipt: ", receiptCrquestTx);

        const volume = await eduChainLinkOracle.volume();
        console.log("Volume: ", Number(volume));
    });

    it("Should rturn volume", async () => {
        const volume = await eduChainLinkOracle.volume();
        console.log("Volume: ", Number(volume));
    });
});