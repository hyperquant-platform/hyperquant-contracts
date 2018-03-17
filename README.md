# HyperQuant contracts
HyperQuant token and crowdsale solidity contracts.

Implemented with [OpenZeppelin](https://openzeppelin.org/) - [GitHub](https://github.com/OpenZeppelin/zeppelin-solidity)

Compiled with [Truffle](http://truffleframework.com/) - [GitHub](https://github.com/trufflesuite/truffle)

## Setup
Clone project and install dependencies.
```sh
git clone https://github.com/hyperquant-platform/hyperquant-contracts.git
npm install
```

## Migrations
Before running migrations edit environment variables in `setenv.sh`.
Your account have to be unlocked before migrating on testnet or mainnet.

Setup enviroment and do migrations.

```
source setenv.sh
npx truffle migrate --network rinkeby
```

## Testing
Setup environment and run tests.
```
source setenv.sh  # dummy values can be used here
npm test
```