import Route from '@ember/routing/route';
import Transition from '@ember/routing/-private/transition';

export default class AbortedStateRoute extends Route {

  beforeModel(transition: Transition): any {
    transition.abort();

    this.transitionTo('template-style-only');

    super.beforeModel(transition);
  }
}
