import BaseRules from 'dummy/components/base-rules/component';
// @ts-ignore
import {styleNamespace} from './styles';
import {classNameBindings} from '@ember-decorators/component';

@classNameBindings('styleNamespace')
export default class CssBaseRules extends BaseRules.extend({
  styleNamespace
}) {
}
