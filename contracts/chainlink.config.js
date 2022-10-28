const config = {
  // Hardhat local network
  // Mock Data (it won't work)
  31337: {
    name: "hardhat",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    fee: "0.1",
    fundAmount: "10000000000000000000",
  },
  1: {
    name: "mainnet",
    linkToken: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    vrfCoordinator: "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952",
    keyHash:
      "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445",
    fee: "2",
  },
  // Goerli
  5: {
    name: "goerli",
    linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    vrfCoordinator: "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B",
    keyHash:
      "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    fee: "0.1",
    fundAmount: "2000000000000000000",
  },
};

const autoFundCheck = async (
  contractAddr,
  networkName,
  linkTokenAddress
  ) => {
  const chainId = 31337; //await getChainId();
  console.log("Checking to see if contract can be auto-funded with LINK:");
  const amount = config[chainId].fundAmount;
  // check to see if user has enough LINK
  const accounts = await ethers.getSigners();
  const signer = accounts[0];
  const LinkToken = await ethers.getContractFactory("LinkToken");
  const linkTokenContract = new ethers.Contract(
    linkTokenAddress,
    LinkToken.interface,
    signer
  );
  const balanceHex = await linkTokenContract.balanceOf(signer.address);
  const balance = await ethers.BigNumber.from(balanceHex._hex).toString();
  const contractBalanceHex = await linkTokenContract.balanceOf(contractAddr);
  const contractBalance = await ethers.BigNumber.from(
    contractBalanceHex._hex
  ).toString();
  if (balance > amount && amount > 0 && contractBalance < amount) {
    // user has enough LINK to auto-fund
    // and the contract isn't already funded
    return true;
  } else {
    // user doesn't have enough LINK, print a warning
    console.log(
      "Account doesn't have enough LINK to fund contracts, or you're deploying to a network where auto funding isnt' done by default"
    );
    console.log(
      "Please obtain LINK via the faucet at https://" +
      networkName +
      ".chain.link/, then run the following command to fund contract with LINK:"
    );
    return false;
  }
};

module.exports = {
  config,
  autoFundCheck
};