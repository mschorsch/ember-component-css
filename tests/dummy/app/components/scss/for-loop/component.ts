import Component from '@ember/component';
import {computed} from '@ember/object';

export default class ScssForLoop extends Component {

  @computed()
  get items(): Array<number> {
    return [...Array(10).keys()];
  }
}
