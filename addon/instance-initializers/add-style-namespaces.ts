import ApplicationInstance from '@ember/application/instance';
import RouterService from '@ember/routing/router-service';
import RouteInfo from '@ember/routing/-private/route-info';

// FIXME ts-ignore

export function initialize(appInstance: ApplicationInstance): void {
  const router: RouterService = appInstance.lookup('service:router');
  router.on('routeDidChange', function ({to}) {
    if (likeRouteInfo(to)) {
      addRouteStyleNamespace(appInstance, nestedRouteNames(to));
    }
  });

  // @ts-ignore
  router.on('routeWillChange', function ({to, isActive}) {
    if (likeRouteInfo(to)) {
      if (/_loading$/.test(to.name) && isActive) {
        const routeNames = nestedRouteNames(to)
          // loading route names are set with an _loading even though
          // their path is -loading
          .map(name => name.replace(/_loading$/, '-loading'));
        addRouteStyleNamespace(appInstance, routeNames);
      }
    }
  });

  addComponentStyleNamespace(appInstance);
}

function nestedRouteNames({name, parent}: RouteInfo, routeNames: Array<string> = []): Array<string> {
  routeNames.push(name);
  if (parent) {
    return nestedRouteNames(parent, routeNames);
  }
  return routeNames;
}

function likeRouteInfo(info: RouteInfo): boolean {
  return info && typeof info === 'object' && Object.prototype.hasOwnProperty.call(info, 'name');
}

function addComponentStyleNamespace(owner: any): void {
  const styles = owner.lookup('container-debug-adapter:main').catalogEntriesByType('styles');

  for (const stylePath of styles) {
    const component = owner.lookup(`component:${stylePath}`);
    const {styleNamespace} = owner.lookup(`styles:${stylePath}`) || {};

    if (styleNamespace && component) {
      const proto = Object.getPrototypeOf(component);

      if (!component.styleNamespace) {
        proto.styleNamespace = styleNamespace;
      }

      if (!component.classNameBindings.includes('styleNamespace')) {
        proto.classNameBindings = component.classNameBindings.concat('styleNamespace');
      }
    }
  }
}

function addRouteStyleNamespace(owner: any, routes: Array<string>): void {
  const classes = [];

  for (const name of routes) {
    const {styleNamespace} = owner.lookup(`styles:${name}`) || {};
    const controller = owner.lookup(`controller:${name}`);

    if (styleNamespace && controller) {
      controller.set('styleNamespace', styleNamespace);
      classes.push(styleNamespace);
    }
  }

  if (owner.lookup('controller:application')) {
    owner.lookup('controller:application').set('routeStyleNamespaceClassSet', classes.join(' '));
  }
}

export default {
  initialize
}
