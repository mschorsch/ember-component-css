import Route from '@ember/routing/route';
import {later} from '@ember/runloop';
import RSVP from 'rsvp';
import Transition from '@ember/routing/-private/transition';

export default class LoadingStateWaitingRoute extends Route {

  model(_params: {}, _transition: Transition): any {
    return new RSVP.Promise(resolve => later(resolve, 500));
  }
}
