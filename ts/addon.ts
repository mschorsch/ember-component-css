import {ExtendOptions, ExtendThisType} from 'core-object';
import Addon from 'ember-cli/lib/models/addon';
import {
  ColocatedNamespaceObjects,
  ColocatedNamespaceTemplates,
  ColocateStyles,
  NamespaceStyles
} from './colocate-namespace';
import funnel from 'broccoli-funnel';
import path from 'path';
import EmberApp from 'ember-cli/lib/broccoli/ember-app';
import EmberAddon from 'ember-cli/lib/broccoli/ember-addon';
import {InputNode} from 'broccoli-node-api';

function addon<T extends ExtendOptions<Addon>>(options: T & ExtendThisType<Addon, T>): T {
  return options;
}

// FIXME
// - remove ember-cli-styles-preprocessor???
// - tsconfig strict checks
// - remove ts-ignores
// - eslint more strict
// - register setupPreprocessorRegistry in included? (see https://github.com/FortAwesome/ember-fontawesome/blob/64cc1786bd05479862c71f25da0c6db8a33861dd/index.js#L193)
// - update dependencies to the latest
// - fix template-lintrc for 'no-implicit-this'
// - inline `broccoli-file-manifest` and `broccoli-tree-walker`??

export default addon({

  name: 'ember-component-css',

  isDevelopingAddon(): boolean {
    return true;
  },

  _defaultOptions(enviroment = true) {
    return {
      // @ts-ignore
      terseClassNames: enviroment === 'production',
    };
  },

  // @ts-ignore
  _options({ options: { emberCliStyles } = {}}) {
    return Object.assign(this._defaultOptions(), emberCliStyles);
  },

  setupPreprocessorRegistry(_type, registry) {
    // @ts-ignore
    const app = registry.app;

    const baseNode = findBaseNode(app);
    const { terseClassNames } = this._options(app);

    registry.add('css', new ColocateStyles({
      getExtentions: registry.extensionsForType.bind(registry),
      baseNode,
    }));

    registry.add('css', new NamespaceStyles({
      getExtentions: registry.extensionsForType.bind(registry),
      baseNode,
      terseClassNames,
    }));

    registry.add('js', new ColocatedNamespaceObjects({
      getExtentions: registry.extensionsForType.bind(registry),
      baseNode,
    }));

    registry.add('template', new ColocatedNamespaceTemplates({
      getExtentions: registry.extensionsForType.bind(registry),
      baseNode,
      terseClassNames,
    }));
  }
});

function findBaseNode(app: EmberApp | EmberAddon): InputNode {
  // @ts-ignore
  if (app.treePaths) {
    // @ts-ignore
    return funnel(path.join(app.root, app.treePaths.addon));
  } else {
    // @ts-ignore
    const appTree = (app.app || app).trees.app;
    if (typeof appTree === 'string') {
      return funnel(path.join(app.project.root, appTree));
    } else {
      return appTree;
    }
  }
}
