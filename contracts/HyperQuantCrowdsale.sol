pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/crowdsale/Crowdsale.sol';
import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import './crowdsale/CappedMintedCrowdsale.sol';
import './crowdsale/FinalizableCrowdsale.sol';

/**
 * @title HyperQuantCrowdsale
 * @dev Implements CappedMintedCrowdsale and FinalizableCrowdsale.
 */
contract HyperQuantCrowdsale is CappedMintedCrowdsale, FinalizableCrowdsale {

  function HyperQuantCrowdsale(uint256 _rate, address _wallet, MintableToken _token, uint256 _tokenSellCap) public
    Crowdsale(_rate, _wallet, _token)
    CappedMintedCrowdsale(_tokenSellCap)
  {
  }

  /**
   * @dev Returns token ownership back to owner.
   */
  function returnTokenOwnership() onlyOwner public {
    MintableToken(token).transferOwnership(owner);
  }

}
