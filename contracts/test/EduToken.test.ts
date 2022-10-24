import { expect } from "chai";
import { ethers } from "hardhat";

describe("EduToken", function () {
  it("Should have the correct initial supply", async function () {

    const [owner] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();

    const initialSupply = ethers.utils.parseEther("100000");
    const EduToken = await ethers.getContractFactory("EduToken");
    const eduToken = await EduToken.deploy(initialSupply);
    await eduToken.deployed();

    const supply = await eduToken.balanceOf(ownerAddress);
    expect(supply).to.equal(initialSupply);
  });
});
