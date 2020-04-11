import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import Transition from '@ember/routing/-private/transition';

export default class SassNestedRoute extends Route {

  model(_params: {}, _transition: Transition): Promise<void> {
    return new Promise(resolve => later(resolve, 500));
  }
}
