pragma solidity ^0.4.17;

import "../token/FrozenToken.sol";


contract FrozenTokenMock is FrozenToken {

  function FrozenTokenMock(address initialAccount, uint initialBalance) public {
    balances[initialAccount] = initialBalance;
  }

}
