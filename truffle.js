require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');

module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      from: process.env.NetworksRinkebyFrom,
      network_id: 4,
      gas: 4612388
    },
    private: {
      host: "localhost",
      port: 8545,
      from: process.env.NetworksPrivateFrom,
      network_id: 1114,
      gas: 4612388
    }
  }
};