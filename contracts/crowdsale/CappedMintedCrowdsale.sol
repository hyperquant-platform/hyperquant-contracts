pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';


/**
 * @title CappedCrowdsale
 * @dev Crowdsale with a limit for total tokens that can be minted.
 */
contract CappedMintedCrowdsale is MintedCrowdsale {
  using SafeMath for uint256;

  uint256 public tokensMinted = 0;
  uint256 public tokensCap;

  /**
   * @dev Constructor, takes maximum amount of tokens can be minted during crowdsale.
   * @param _tokensCap Max amount of tokens to be minted
   */
  function CappedMintedCrowdsale(uint256 _tokensCap) public {
    require(_tokensCap > 0);
    tokensCap = _tokensCap;
  }

  /**
   * @dev Shows remaining amount of tokens that can be minted during crowdsale.
   * @return Remaining amount of tokens that can be minted
   */
  function tokensLeft() public view returns (uint256) {
    return tokensCap.sub(tokensMinted);
  }

  /**
   * @dev Extend parent behavior to validate maximum cap.
   * @param _weiAmount Value in wei to be converted into tokens
   * @return Number of tokens that can be purchased with the specified _weiAmount
   */
  function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
    uint256 tokenAmount = super._getTokenAmount(_weiAmount);
    require(tokensMinted.add(tokenAmount) <= tokensCap);
    return tokenAmount;
  }

  /**
  * @dev Extend parent behavior to save minted amount.
  * @param _beneficiary Token purchaser
  * @param _tokenAmount Number of tokens to be minted
  */
  function _deliverTokens(address _beneficiary, uint256 _tokenAmount) internal {
    tokensMinted = tokensMinted.add(_tokenAmount);
    super._deliverTokens(_beneficiary, _tokenAmount);
  }
}
