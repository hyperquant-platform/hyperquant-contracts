pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/crowdsale/Crowdsale.sol';

/**
 * @title FinalizableCrowdsale
 * @dev Zeppelin-solidity's finalizable crowdsale with extra modifiers
 * based on basic Crowdsale instead of TimedCrowdsale.
 */
contract FinalizableCrowdsale is Crowdsale, Ownable {
  using SafeMath for uint256;

  bool public finalized = false;

  event Finalized();

  /**
   * @dev Modifier to make a function callable only when the contract is finalized.
   */
  modifier whenFinalized() {
    require(finalized);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is not finalized.
   */
  modifier whenNotFinalized() {
    require(!finalized);
    _;
  }

  /**
   * @dev Must be called after crowdsale ends, to do some extra finalization
   * work. Calls the contract's finalization function.
   */
  function finalize() onlyOwner public {
    require(!finalized);

    finalization();
    Finalized();

    finalized = true;
  }

  /**
   * @dev Extend parent behavior requiring to be not finalized.
   * @param _beneficiary Token purchaser
   * @param _weiAmount Amount of wei contributed
   */
  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal whenNotFinalized {
    super._preValidatePurchase(_beneficiary, _weiAmount);
  }

  /**
   * @dev Can be overridden to add finalization logic. The overriding function
   * should call super.finalization() to ensure the chain of finalization is
   * executed entirely.
   */
  function finalization() internal {
  }
}
