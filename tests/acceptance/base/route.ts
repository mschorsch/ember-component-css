import {visit} from '@ember/test-helpers';
import {test} from 'qunit';
import {StyleForTestContext} from 'dummy/tests/setup/style-for';

export default function (type: string): void {
  test('route style followed', async function (this: StyleForTestContext, assert) {
    await visit(`/${type}`);

    const color = this.styleFor(`div[class*="__${type}"]`).color;
    assert.equal(color, 'rgb(0, 1, 0)');
  });

  test('nested route style followed', async function (this: StyleForTestContext, assert) {
    await visit(`/${type}/nested`);

    const color = this.styleFor(`div[class*="__${type}__nested"]`).color;
    assert.equal(color, 'rgb(0, 2, 0)');
  });
}
