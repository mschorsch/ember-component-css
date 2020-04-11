import {visit} from '@ember/test-helpers';
import {test} from 'qunit';
import {StyleForTestContext} from 'dummy/tests/setup/style-for';

export default function (type: string): void {
  test('base rule followed', async function (this: StyleForTestContext, assert) {
    await visit(`/${type}`);

    const color = this.styleFor('.base').color;
    assert.equal(color, 'rgb(0, 0, 1)');
  });

  test('nested rule followed', async function (this: StyleForTestContext, assert) {
    await visit(`/${type}`);

    const color = this.styleFor('.nested').color;
    assert.equal(color, 'rgb(0, 0, 2)');
  });

  test('non class nested rule followed', async function (this: StyleForTestContext, assert) {
    await visit(`/${type}`);

    const color = this.styleFor('span span span').color;
    assert.equal(color, 'rgb(0, 0, 3)');
  });
}
