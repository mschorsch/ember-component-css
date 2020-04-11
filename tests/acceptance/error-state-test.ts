import {visit, currentURL} from '@ember/test-helpers';
import {module, test} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import styleForSetup, {StyleForTestContext} from 'dummy/tests/setup/style-for';

module('Acceptance | error state', function (hooks: NestedHooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('handled error state does not throw', async function (this: StyleForTestContext, assert) {
    assert.expect(2);

    await visit('/error-state/handled');

    assert.equal(currentURL(), '/error-state');
    assert.equal(this.styleFor('h1').color, 'rgb(0, 0, 14)');
  });
});
