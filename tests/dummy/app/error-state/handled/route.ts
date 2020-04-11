import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import Transition from '@ember/routing/-private/transition';
import {action} from '@ember/object';

export default class ErrorStateHandledRoute extends Route {

  model(_params: {}, _transition: Transition): RSVP.Promise<never> {
    return RSVP.Promise.reject();
  }

  @action
  error(_error: any, _transition: Transition): void {
    this.transitionTo('error-state');
  }
}
