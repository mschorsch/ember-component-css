import {visit} from '@ember/test-helpers';
import {test} from 'qunit';
import {StyleForTestContext} from 'dummy/tests/setup/style-for';

export default function (type: string): void {
  test('BEM rule followed', async function (this: StyleForTestContext, assert) {
    await visit(`/${type}`);

    const color = this.styleFor('[class$=__element]').color;
    assert.equal(color, 'rgb(0, 0, 4)');
  });

  test('BEM variant rule followed', async function (this: StyleForTestContext, assert) {
    await visit(`/${type}`);

    const color = this.styleFor('[class$=__element--variant]').color;
    assert.equal(color, 'rgb(0, 0, 5)');
  });
}
