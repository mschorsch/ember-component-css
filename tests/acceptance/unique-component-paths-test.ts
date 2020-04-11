import {visit} from '@ember/test-helpers';
import {module, skip} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import styleForSetup, {StyleForTestContext} from 'dummy/tests/setup/style-for';

module('Acceptance | Unique Paths', function (hooks: NestedHooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  skip('base rule followed', async function (this: StyleForTestContext, assert) {
    assert.expect(1);

    await visit('/unique-component-paths');

    assert.equal(this.styleFor('h1').color, 'rgb(0, 0, 14)');
  });
});
