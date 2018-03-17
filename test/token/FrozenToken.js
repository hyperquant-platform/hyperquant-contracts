import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';

const FrozenToken = artifacts.require('FrozenTokenMock');

contract('FrozenToken', function ([_, owner, recipient, anotherAccount]) {
  const allTokens = web3.toBigNumber(100);
  const partOfTokens = web3.toBigNumber(33);

  beforeEach(async function () {
    this.token = await FrozenToken.new(owner, allTokens, { from: owner });
  });

  describe('frozen', function () {
    it('is frozen by default', async function () {
      const frozen = await this.token.frozen({ from: owner });

      assert.isTrue(frozen);
    });

    it('is not frozen after being unfrozen', async function () {
      await this.token.unfreeze({ from: owner });

      const frozen = await this.token.frozen({ from: owner });
      assert.isFalse(frozen);
    });
  });

  describe('transfer', function () {
    it('reverts when trying to transfer when frozen', async function () {
      await assertRevert(this.token.transfer(recipient, allTokens, { from: owner }));
    });

    it('allows to transfer when not frozen', async function () {
      await this.token.unfreeze({ from: owner });
      await this.token.transfer(recipient, allTokens, { from: owner });

      const senderBalance = await this.token.balanceOf(owner);
      assert.isTrue(senderBalance.eq(0));

      const recipientBalance = await this.token.balanceOf(recipient);
      assert.isTrue(recipientBalance.eq(allTokens));
    });
  });

  describe('transfer from', function () {
    it('reverts when trying to transfer when frozen', async function () {
      await assertRevert(this.token.transferFrom(owner, recipient, partOfTokens, { from: anotherAccount }));
    });

    it('allows to transfer when not frozen', async function () {
      await this.token.unfreeze({ from: owner });
      await this.token.approve(anotherAccount, partOfTokens, { from: owner });
      await this.token.transferFrom(owner, recipient, partOfTokens, { from: anotherAccount });

      const senderBalance = await this.token.balanceOf(owner);
      assert.isTrue(senderBalance.eq(67));

      const recipientBalance = await this.token.balanceOf(recipient);
      assert.isTrue(recipientBalance.eq(partOfTokens));
    });
  });

  describe('approve', function () {
    it('reverts when trying to approve when frozen', async function () {
      await assertRevert(this.token.approve(anotherAccount, partOfTokens, { from: owner }));
    });

    it('allows to approve when not frozen', async function () {
      await this.token.unfreeze({ from: owner });
      await this.token.approve(anotherAccount, partOfTokens, { from: owner });

      const allowance = await this.token.allowance(owner, anotherAccount);
      assert.isTrue(allowance.eq(partOfTokens));
    });
  });

  describe('decrease approval', function () {
    it('reverts when trying to decrease approval when frozen', async function () {
      await assertRevert(this.token.decreaseApproval(anotherAccount, partOfTokens, { from: owner }));
    });

    it('allows to decrease approval when not frozen', async function () {
      await this.token.unfreeze({ from: owner });
      await this.token.approve(anotherAccount, allTokens, { from: owner });
      await this.token.decreaseApproval(anotherAccount, partOfTokens, { from: owner });

      const allowance = await this.token.allowance(owner, anotherAccount);
      assert.isTrue(allowance.eq(67));
    });
  });

  describe('increase approval', function () {
    it('reverts when trying to increase approval when frozen', async function () {
      await assertRevert(this.token.increaseApproval(anotherAccount, allTokens, { from: owner }));
    });

    it('allows to increase approval when not frozen', async function () {
      await this.token.unfreeze({ from: owner });
      await this.token.approve(anotherAccount, allTokens, { from: owner });
      await this.token.increaseApproval(anotherAccount, partOfTokens, { from: owner });

      const allowance = await this.token.allowance(owner, anotherAccount);
      assert.isTrue(allowance.eq(133));
    });
  });

});
