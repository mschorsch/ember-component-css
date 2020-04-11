import { visit, currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import styleForSetup, {StyleForTestContext} from 'dummy/tests/setup/style-for';

module('Acceptance | aborted state', function(hooks: NestedHooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('should still render for aborted stte', async function(this: StyleForTestContext, assert) {
    assert.expect(2);

    await visit('/css/aborted-state');

    assert.equal(currentURL(), '/css/nested');
    assert.equal(this.styleFor('[class$=__nested]').color, 'rgb(0, 2, 0)');
  });
});
