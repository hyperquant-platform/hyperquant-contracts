pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../crowdsale/FinalizableCrowdsale.sol";


contract FinalizableCrowdsaleImpl is FinalizableCrowdsale {

  function FinalizableCrowdsaleImpl(uint256 _rate, address _wallet, ERC20 _token) public
    Crowdsale(_rate, _wallet, _token)
  {
  }

}