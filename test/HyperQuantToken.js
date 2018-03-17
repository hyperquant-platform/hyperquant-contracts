import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';

const HyperQuantToken = artifacts.require('HyperQuantToken');

contract('HyperQuantToken', function ([_, owner, recipient, anotherAccount]) {
  const cap = web3.toBigNumber(382000000 * (10 ** 18));
  const lessThanCap = web3.toBigNumber(100);

  beforeEach(async function () {
    this.token = await HyperQuantToken.new({ from: owner });
  });

  describe('cap', function () {
    it('should start with the correct cap', async function () {
      const tokenCap = await this.token.cap();
      assert.isTrue(tokenCap.eq(cap))
    });
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

  describe('mint', function () {
    it('is allowed when frozen', async function () {
      const frozen = await this.token.frozen();
      assert.isTrue(frozen);

      await this.token.mint(recipient, lessThanCap, { from: owner });
      const recipientBalance = await this.token.balanceOf(recipient);
      assert.isTrue(recipientBalance.eq(lessThanCap));
    });

    it('is allowed when not frozen', async function () {
      await this.token.unfreeze({ from: owner });
      const frozen = await this.token.frozen();
      assert.isFalse(frozen);

      await this.token.mint(recipient, lessThanCap, { from: owner });
      const recipientBalance = await this.token.balanceOf(recipient);
      assert.isTrue(recipientBalance.eq(lessThanCap));
    });

    it('should proceed when amount is less than cap', async function () {
      await this.token.mint(recipient, lessThanCap, { from: owner });
      const recipientBalance = await this.token.balanceOf(recipient);

      assert.isTrue(recipientBalance.eq(lessThanCap));
    });

    it('shouldn\'t proceed when amount exceeds the cap', async function () {
      await this.token.mint(recipient, cap.sub(1), { from: owner });
      await assertRevert(this.token.mint(recipient, 100), { from: owner });
    });

    it('shouldn\'t proceed after cap is reached', async function () {
      await this.token.mint(recipient, cap, { from: owner });
      await assertRevert(this.token.mint(recipient, 1), { from: owner });
    });
  });

  describe('transfer', function () {
    it('reverts when trying to transfer when frozen', async function () {
      await this.token.mint(owner, cap, { from: owner });
      await assertRevert(this.token.transfer(recipient, cap, { from: owner }));
    });

    it('allows to transfer when not frozen', async function () {
      await this.token.mint(owner, cap, { from: owner });
      await this.token.unfreeze({ from: owner });
      await this.token.transfer(recipient, cap, { from: owner });

      const senderBalance = await this.token.balanceOf(owner);
      assert.isTrue(senderBalance.eq(0));

      const recipientBalance = await this.token.balanceOf(recipient);
      assert.isTrue(recipientBalance.eq(cap));
    });
  });

  describe('transfer from', function () {
    it('reverts when trying to transfer when frozen', async function () {
      await this.token.mint(owner, lessThanCap, { from: owner });
      await assertRevert(this.token.transferFrom(owner, recipient, lessThanCap, { from: anotherAccount }));
    });

    it('allows to transfer when not frozen', async function () {
      await this.token.mint(owner, lessThanCap, { from: owner });
      await this.token.unfreeze({ from: owner });
      await this.token.approve(anotherAccount, lessThanCap, { from: owner });
      await this.token.transferFrom(owner, recipient, lessThanCap, { from: anotherAccount });

      const senderBalance = await this.token.balanceOf(owner);
      assert.isTrue(senderBalance.eq(0));

      const recipientBalance = await this.token.balanceOf(recipient);
      assert.isTrue(recipientBalance.eq(lessThanCap));
    });
  });

  describe('approve', function () {
    it('reverts when trying to approve when frozen', async function () {
      await assertRevert(this.token.approve(anotherAccount, lessThanCap, { from: owner }));
    });

    it('allows to approve when not frozen', async function () {
      await this.token.unfreeze({ from: owner });
      await this.token.approve(anotherAccount, lessThanCap, { from: owner });

      const allowance = await this.token.allowance(owner, anotherAccount);
      assert.isTrue(allowance.eq(lessThanCap));
    });
  });

});
