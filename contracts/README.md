# Contracts

## Key deps

- hardhat-deploy
- fund-link
- @chainlink/contracts
- @openzeppelin/contracts

## Scripts


Проверка контрактов 
```
npx hardhat test ./test/EduChainLinkOracle.test.ts --network hardhat
```

Deploy `EduChainLinkOracle` to Hardhat Network
```
npx hardhat run scripts/deployEduChainLinkOracle.ts --network hardhat
```

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.ts
```
