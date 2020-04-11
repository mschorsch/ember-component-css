import Route from '@ember/routing/route';
import Transition from '@ember/routing/-private/transition';

export default class CssAbortedStateRoute extends Route {

  beforeModel(transition: Transition): any {
    transition.abort();
    this.transitionTo('css.nested');
  }
}
