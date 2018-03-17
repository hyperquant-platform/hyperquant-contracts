import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';


var Frozen = artifacts.require('Frozen');

contract('Frozen', function ([_, owner, anotherAccount]) {
  beforeEach(async function () {
    this.frozenContract = await Frozen.new({ from: owner });
  });

  describe('unfreeze', function () {
    describe('when the sender is the contract owner', function () {
      describe('when the contract is frozen', function () {
        it('unfreezes the contract', async function () {
          await this.frozenContract.unfreeze({ from: owner });

          const frozen = await this.frozenContract.frozen();
          assert.isFalse(frozen);
        });

        it('emits an unfreeze event', async function () {
          const { logs } = await this.frozenContract.unfreeze({ from: owner });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Unfreeze');
        });
      });

      describe('when the contract is unfrozen', function () {
        beforeEach(async function() {
          await this.frozenContract.unfreeze({ from: owner });
        })

        it('reverts', async function () {
          await assertRevert(this.frozenContract.unfreeze({ from: owner }));
        });
      });
    });

    describe('when the sender is not the contract owner', function () {
      it('reverts', async function () {
        await assertRevert(this.frozenContract.unfreeze({ from: anotherAccount }));
      });
    });
  });
});
