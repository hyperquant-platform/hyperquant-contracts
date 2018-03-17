import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';

const CappedMintedCrowdsale = artifacts.require('CappedMintedCrowdsaleImpl');
const MintableToken = artifacts.require('MintableToken');

contract('CappedMintedCrowdsale', function ([_, owner, sender, wallet, anotherAccount]) {
  const rate = web3.toBigNumber(1000);
  const tokensCap = web3.toBigNumber('1e20');
  const weiToCap = tokensCap.div(rate);
  const lessThanCap = tokensCap.div(rate).div(2);
  const wei = web3.toBigNumber(1);

  beforeEach(async function () {
    this.token = await MintableToken.new({ from: owner });
    this.crowdsale = await CappedMintedCrowdsale.new(rate, wallet, this.token.address, tokensCap, { from: owner });
    await this.token.transferOwnership(this.crowdsale.address, { from: owner });
  });

  describe('creating a valid crowdsale', function () {
    it('should fail with zero token cap', async function () {
      await assertRevert(CappedMintedCrowdsale.new(rate, wallet, 0, this.token.address));
    });
  });

  describe('accepting payments', function () {
    it('should accept payments within cap', async function () {
      await this.crowdsale.send(wei, { from: sender });
      await this.crowdsale.send(lessThanCap, { from: sender });

      const weiRaised = await this.crowdsale.weiRaised();
      assert.isTrue(lessThanCap.plus(wei).eq(weiRaised));
    });

    it('should reject payments outside cap', async function () {
      await this.crowdsale.send(weiToCap, { from: sender });
      await assertRevert(this.crowdsale.send(wei, { from: sender }));
    });

    it('should reject payments that exceed cap', async function () {
      await this.crowdsale.send(lessThanCap, { from: sender });
      await assertRevert(this.crowdsale.send(lessThanCap.plus(wei), { from: sender }));
    });
  });

  describe('tokens cap', function () {
    it('should return correct value', async function () {
      const cap = await this.crowdsale.tokensCap();
      assert.isTrue(cap.eq(tokensCap));
    });
  });

  describe('tokens minted', function () {
    it('should return 0 at start', async function () {
      const mintedAmount = await this.crowdsale.tokensMinted();
      assert.isTrue(mintedAmount.eq(0));
    });

    it('should return correct value after payment', async function () {
      await this.crowdsale.send(wei, { from: sender });
      const mintedAmount = await this.crowdsale.tokensMinted();

      assert.isTrue(mintedAmount.eq(rate));
    });

    it('should equal cap when cap is reached', async function () {
      await this.crowdsale.send(weiToCap, { from: sender });
      const mintedAmount = await this.crowdsale.tokensMinted();

      assert.isTrue(mintedAmount.eq(tokensCap));
    });

    it('should equal token\'s totalSupply', async function () {
      await this.crowdsale.send(weiToCap, { from: sender });
      const mintedAmount = await this.crowdsale.tokensMinted();
      const totalSupply = await this.token.totalSupply();

      assert.isTrue(mintedAmount.eq(totalSupply));
    });
  });

  describe('tokens left', function () {
    it('should return correct value', async function () {
      await this.crowdsale.send(weiToCap.sub(wei), { from: sender });
      const tokensLeft = await this.crowdsale.tokensLeft();

      // only 1000 (=rate) tokens left
      assert.isTrue(tokensLeft.eq(rate));
    });

    it('should return 0 when capped', async function () {
      await this.crowdsale.send(weiToCap, { from: sender });

      const tokensLeft = await this.crowdsale.tokensLeft();
      assert.isTrue(tokensLeft.eq(0));
    });

    it('should return cap when 0 wei raised', async function () {
      const tokensLeft = await this.crowdsale.tokensLeft();
      const tokensCap = await this.crowdsale.tokensCap();

      assert.isTrue(tokensLeft.eq(tokensCap));
    });
  });

});
