pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


/**
 * @title Frozen
 * @dev Base contract which allows to implement initially frozen mechanic.
 * Based on Zeppelin-solidity's Pausable contract.
 */
contract Frozen is Ownable {
  event Unfreeze();

  bool public frozen = true;

  /**
   * @dev Modifier to make a function callable only when the contract is not frozen.
   */
  modifier whenNotFrozen() {
    require(!frozen);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is frozen.
   */
  modifier whenFrozen() {
    require(frozen);
    _;
  }

  /**
   * @dev called by the owner to unfreeze
   */
  function unfreeze() onlyOwner whenFrozen public {
    frozen = false;
    Unfreeze();
  }
}
