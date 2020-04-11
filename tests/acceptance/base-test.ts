import {module} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import styleForSetup from 'dummy/tests/setup/style-for';
import basic from './base/basic';
import bem from './base/bem';
import route from './base/route';

const STYLE_TYPES = [
  'css',
  'less',
  'styl',
  'sass',
  'scss',
];

const ADDON_TYPES = [
  'less',
  'scss',
];

// FIXME ts ignore

module('Acceptance', function (hooks: NestedHooks) {
  setupApplicationTest(hooks);
  styleForSetup(hooks);

  for (const type of STYLE_TYPES) {
    module(type, function () {
      // @ts-ignore
      basic.call(this, type);
      // @ts-ignore
      bem.call(this, type);
      // @ts-ignore
      route.call(this, type);
    });
  }

  for (const type of ADDON_TYPES) {
    module(`${type} Addon`, function () {
      // @ts-ignore
      basic.call(this, `addon/${type}`);
      // @ts-ignore
      bem.call(this, `addon/${type}`);
    });
  }
});
