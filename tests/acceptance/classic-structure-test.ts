import {visit} from '@ember/test-helpers';
import {module, skip} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';

import styleForSetup, {StyleForTestContext} from 'dummy/tests/setup/style-for';

module('Acceptance | classic structure', function (hooks: NestedHooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  skip('should be able to use classic structure style', async function (this: StyleForTestContext, assert) {
    assert.expect(1);

    await visit('/classic-structure');

    const color = this.styleFor('.classic-structure').color;
    assert.equal(color, 'rgb(0, 0, 1)');
  });

  skip('should be able to use classic structure style nested', async function (this: StyleForTestContext, assert) {
    assert.expect(1);

    await visit('/classic-structure-nested');

    const color = this.styleFor('.classic-structure-nested').color;
    assert.equal(color, 'rgb(0, 0, 1)');
  });
});
