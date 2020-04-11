import Route from '@ember/routing/route';

export default class QueryParamsRoute extends Route {

  queryParams = {
    foo: {
      refreshModel: true,
    }
  }
}
