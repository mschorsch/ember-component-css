import Controller from '@ember/controller';

export default class QueryParamsController extends Controller {

  queryParams = ['foo'];
  foo?: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'query-params': QueryParamsController;
  }
}
