pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/token/ERC20/BasicToken.sol";


contract BasicTokenMock is BasicToken {

  function BasicTokenMock(address initialAccount, uint256 initialBalance) public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

}
