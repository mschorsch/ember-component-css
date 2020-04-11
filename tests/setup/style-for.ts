import {find} from '@ember/test-helpers';
import {TestContext} from 'ember-test-helpers';

export interface StyleForTestContext extends TestContext {
  styleFor(cssSelector: string | Element): CSSStyleDeclaration;
}

export default function (hooks: NestedHooks): void {
  hooks.beforeEach(function (this: StyleForTestContext, _assert: Assert) {
    this.styleFor = (cssSelector: string | Element): CSSStyleDeclaration => {
      const elem = typeof cssSelector === 'string' ? find(cssSelector) : cssSelector;
      if (elem === null) {
        throw new Error(`Element '${cssSelector}' not found`);
      }
      return window.getComputedStyle(elem);
    }
  });
}
