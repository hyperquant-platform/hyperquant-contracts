pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../crowdsale/CappedMintedCrowdsale.sol";


contract CappedMintedCrowdsaleImpl is CappedMintedCrowdsale {

  function CappedMintedCrowdsaleImpl(uint256 _rate, address _wallet, ERC20 _token, uint256 _tokensCap) public
    Crowdsale(_rate, _wallet, _token)
    CappedMintedCrowdsale(_tokensCap)
  {
  }

}