import {visit} from '@ember/test-helpers';
import {module, test} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import styleForSetup, {StyleForTestContext} from 'dummy/tests/setup/style-for';

module('Acceptance | no style files yet', function (hooks: NestedHooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('should not have to include a style file inorder to build and render', async function (this: StyleForTestContext, assert) {
    assert.expect(1);

    await visit('/no-style-files-yet');

    assert.equal(this.styleFor('.base').color, 'rgb(0, 0, 0)');
  });
});
