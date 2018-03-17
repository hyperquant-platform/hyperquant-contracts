import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';

const FinalizableCrowdsale = artifacts.require('FinalizableCrowdsaleImpl');
const BasicToken = artifacts.require('BasicTokenMock');

contract('FinalizableCrowdsale', function ([_, owner, sender, wallet, anotherAccount]) {
  const rate = web3.toBigNumber(1000);
  const tokenAmount = web3.toBigNumber(1000000);

  beforeEach(async function () {
    this.token = await BasicToken.new(owner, tokenAmount);
    this.crowdsale = await FinalizableCrowdsale.new(rate, wallet, this.token.address, { from: owner });
    this.token.transfer(this.crowdsale.address, tokenAmount, { from: owner });
  });

  describe('finalize', function () {
    describe('when the sender is the contract owner', function () {
      it('can be finalized', async function () {
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
  });

  describe('finalized', function () {
    it('is false by default', async function () {
      const finalize = await this.crowdsale.finalized();
      assert.isFalse(finalize);
    });

    it('is true after finalize', async function () {
      await this.crowdsale.finalize({ from: owner });

      const finalize = await this.crowdsale.finalized();
      assert.isTrue(finalize);
    });
  });

  describe('accepting payments', function () {
    const ether = web3.toBigNumber(100);
    it('should accept payments when not finalized', async function () {
      await this.crowdsale.send(ether, { from: sender });

      const weiRaised = await this.crowdsale.weiRaised();
      assert.isTrue(ether.eq(weiRaised));
    });

    it('should reject payments when finalized', async function () {
      await this.crowdsale.finalize({ from: owner });
      await assertRevert(this.crowdsale.send(ether, { from: sender }));
    });
  });
});
