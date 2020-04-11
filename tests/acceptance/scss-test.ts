import {visit, find} from '@ember/test-helpers';
import {module, test} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import styleForSetup, {StyleForTestContext} from 'dummy/tests/setup/style-for';

const TYPE = 'scss';

module(`Acceptance | ${TYPE}`, function (hooks: NestedHooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  test('mixin psudo elements do not get scoped', async function (this: StyleForTestContext, assert) {
    assert.expect(1);

    await visit(`/${TYPE}`);

    const element = find('[class$=__element--variant]') as Element;
    element.classList.add('mixin-extra');
    assert.equal(this.styleFor(element).color, 'rgb(0, 0, 6)');
  });

  test('children of root @for rules are namspaced', async function (this: StyleForTestContext, assert) {
    assert.expect(10);

    await visit(`/${TYPE}`);

    for (const index of Array(10).keys()) {
      const color = this.styleFor(`[class$=__element--${index}]`).color
      assert.equal(color, `rgb(0, 0, ${index})`);
    }
  });
});
