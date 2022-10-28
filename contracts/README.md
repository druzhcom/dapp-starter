# Contracts

## Key deps

- hardhat-deploy
- fund-link
- @chainlink/contracts
- @openzeppelin/contracts
- witnet-solidity-bridge

## Scripts


Проверка контрактов 
```
npx hardhat test ./test/EduVRFOracle.test.ts --network hardhat
npx hardhat test ./test/EduAPIDataOracle.test --network hardhat

```

Deploy `deployEduVRFOracle` to Hardhat Network
```
npx hardhat run scripts/deployEduVRFOracle.ts --network hardhat
```

Deploy `deployEduAPIDataOracle` to Hardhat Network
```
npx hardhat run scripts/deployEduAPIDataOracle.ts --network hardhat
```

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.ts
```
