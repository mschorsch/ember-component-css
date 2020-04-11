import Component from '@ember/component';
import Template from './template';
import {layout, classNameBindings} from '@ember-decorators/component'
// @ts-ignore
import {styleNamespace} from './styles';

@layout(Template)
@classNameBindings('styleNamespace')
export default class SecondAddonLess extends Component.extend({
  styleNamespace
}) {
}
