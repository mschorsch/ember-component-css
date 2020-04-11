import {visit} from '@ember/test-helpers';
import {module, skip} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import styleForSetup, {StyleForTestContext} from 'dummy/tests/setup/style-for';

module('Acceptance | template style only', function (hooks: NestedHooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  skip('should be able to use a pod style with only the style file and a template', async function (this: StyleForTestContext, assert) {
    assert.expect(1);

    await visit('/template-style-only');

    assert.equal(this.styleFor('[class$=__template-only]').color, 'rgb(0, 0, 1)');
  });
});
