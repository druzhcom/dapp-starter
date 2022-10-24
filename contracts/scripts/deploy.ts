import { ethers } from "hardhat";

async function main() {
  const initialSupply = ethers.utils.parseEther("21000000000000");
  const EduToken = await ethers.getContractFactory("EduToken");
  const eduToken = await EduToken.deploy(initialSupply);

  await eduToken.deployed();

  console.log(`Token deployed to ${eduToken.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
