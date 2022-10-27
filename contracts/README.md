# Contracts

## Key deps

- hardhat-deploy
- fund-link
- @chainlink/contracts
- @openzeppelin/contracts

## Scripts

Deploy `EduOracle` to Hardhat Network

```
npx hardhat run scripts/deployEduOracle.ts --network hardhat
```

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.ts
```
