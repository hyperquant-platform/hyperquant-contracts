import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';

const HyperQuantCrowdsale = artifacts.require('HyperQuantCrowdsale');
const HyperQuantToken = artifacts.require('HyperQuantToken');

contract('HyperQuantCrowdsale', function ([_, owner, sender, wallet, anotherAccount]) {
  const rate = web3.toBigNumber(1000);
  const tokensCap = web3.toBigNumber('1e20');
  const weiToCap = tokensCap.div(rate);
  const lessThanCap = tokensCap.div(rate).div(2);
  const wei = web3.toBigNumber(1);

  beforeEach(async function () {
    this.token = await HyperQuantToken.new({ from: owner });
    this.crowdsale = await HyperQuantCrowdsale.new(rate, wallet, this.token.address, tokensCap, { from: owner });
    await this.token.transferOwnership(this.crowdsale.address, { from: owner });
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
      await assertRevert(this.crowdsale.send(weiToCap.plus(wei), { from: sender }));
    });

    it('should accept payments when not finalized', async function () {
      await this.crowdsale.send(lessThanCap, { from: sender });

      const weiRaised = await this.crowdsale.weiRaised();
      assert.isTrue(lessThanCap.eq(weiRaised));
    });

    it('should reject payments when finalized', async function () {
      await this.crowdsale.finalize({ from: owner });
      await assertRevert(this.crowdsale.send(lessThanCap, { from: sender }));
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

  describe('return token ownership', function () {
    describe('when the sender is the contract owner', function () {
      it('should return token ownership to contract owner', async function () {
        await this.crowdsale.returnTokenOwnership({ from: owner });
        const tokenOwner = await this.token.owner();

        assert.equal(tokenOwner, owner);
      });
    });

    describe('when the sender is not the contract owner', function () {
      it('reverts', async function () {
        await assertRevert(this.crowdsale.returnTokenOwnership({ from: anotherAccount }));
      });
    });
  });

  describe('finalize', function () {
    describe('when the sender is the contract owner', function () {
      it('can be finalized', async function () {
        await this.crowdsale.finalize({ from: owner });
      });

      it('can be finalized when capped', async function () {
        await this.crowdsale.send(weiToCap, { from: sender });
        await this.crowdsale.finalize({ from: owner });
      });

      it('can be finalized when not capped', async function () {
        await this.crowdsale.send(lessThanCap, { from: sender });
        await this.crowdsale.finalize({ from: owner });
      });

      it('cannot be finalized twice', async function () {
        await this.crowdsale.finalize({ from: owner });
        await assertRevert(this.crowdsale.finalize({ from: owner }));
      });

      it('emits a finalized event', async function () {
        const { logs } = await this.crowdsale.finalize({ from: owner });

        assert.equal(logs.length, 1);
        assert.equal(logs[0].event, 'Finalized');
      });
    });

    describe('when the sender is not the contract owner', function () {
      it('reverts', async function () {
        await assertRevert(this.crowdsale.finalize({ from: anotherAccount }));
      });
    });
  })

});
