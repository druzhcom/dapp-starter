import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy EduToken contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const initialSupply = hre.ethers.utils.parseEther("21000000000000");
    const EduToken = await hre.ethers.getContractFactory('EduToken');
    // @ts-ignore
    const eduToken = await EduToken.deploy();
    await eduToken.deployed();
    console.log('EduToken deployed to:', eduToken.address);
  }
);
