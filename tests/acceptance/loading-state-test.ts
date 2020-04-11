import {visit, click} from '@ember/test-helpers';
import {module, test} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import {scheduleOnce} from '@ember/runloop';
import styleForSetup, {StyleForTestContext} from 'dummy/tests/setup/style-for';

module('Acceptance | loading state', function (hooks: NestedHooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('loading state is styled', async function (this: StyleForTestContext, assert) {
    assert.expect(3);

    await visit('/loading-state/base');

    assert.equal(this.styleFor('h1').color, 'rgb(0, 0, 14)');

    // eslint-disable-next-line ember/no-incorrect-calls-with-inline-anonymous-functions
    scheduleOnce('afterRender', this, () => {
      assert.equal(this.styleFor('h2').color, 'rgb(1, 0, 13)');
    });

    await click('a[title=Waiting]');
    assert.equal(this.styleFor('h3').color, 'rgb(0, 0, 13)');
  });
});
