pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import "../lifecycle/Frozen.sol";


/**
 * @title Frozen token
 * @dev StandardToken with frozen state, which allows to transfer if token is not frozen.
 * Based on Zeppelin-solidity's PausableToken contract.
 **/
contract FrozenToken is StandardToken, Frozen {

  function transfer(address _to, uint256 _value) public whenNotFrozen returns (bool) {
    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) public whenNotFrozen returns (bool) {
    return super.transferFrom(_from, _to, _value);
  }

  function approve(address _spender, uint256 _value) public whenNotFrozen returns (bool) {
    return super.approve(_spender, _value);
  }

  function increaseApproval(address _spender, uint _addedValue) public whenNotFrozen returns (bool success) {
    return super.increaseApproval(_spender, _addedValue);
  }

  function decreaseApproval(address _spender, uint _subtractedValue) public whenNotFrozen returns (bool success) {
    return super.decreaseApproval(_spender, _subtractedValue);
  }
}