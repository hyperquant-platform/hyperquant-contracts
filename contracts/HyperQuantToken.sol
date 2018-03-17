pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC20/CappedToken.sol';
import './token/FrozenToken.sol';

/**
 * @title HyperQuantToken
 * @dev Impelements CappedToken and FrozenToken.
 */
contract HyperQuantToken is CappedToken, FrozenToken {
  string public constant name = "HyperQuant Token";
  string public constant symbol = "HQT";
  uint8 public constant decimals = 18;

  uint256 constant TOKEN_LIMIT = 382000000 * (10 ** (uint256(decimals)));

  /**
   * @dev Constructor that sets token's cap.
   */
  function HyperQuantToken() public CappedToken(TOKEN_LIMIT) {}
}