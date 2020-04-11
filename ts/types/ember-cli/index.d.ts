declare module 'ember-cli/lib/broccoli/ember-app' {

  import CoreObject from 'core-object';
  import Project from 'ember-cli/lib/models/project';
  import {InputNode} from 'broccoli-node-api';
  import PreprocessRegistry from 'ember-cli-preprocess-registry';

  export default class EmberApp extends CoreObject {

    name: string;
    env: string;
    isProduction: boolean;
    registry: PreprocessRegistry;
    // bowerDirectory: string;

    project: Project;
    options: Record<string, unknown>;

    trees: {
      app: InputNode;
      tests: InputNode;
      styles: InputNode;
      templates: InputNode;
      bower: InputNode | null;
      vendor: InputNode | null;
      public: InputNode;
      [key: string]: InputNode | null;
    };
  }
}

declare module 'ember-cli/lib/broccoli/ember-addon' {

  import EmberApp from 'ember-cli/lib/broccoli/ember-app';

  export default class EmberAddon extends EmberApp {
  }
}

declare module 'ember-cli/lib/models/addon' {

  import CoreObject, {ExtendOptions} from 'core-object';
  import UI from 'console-ui';
  import {Application} from 'express';
  import Project from 'ember-cli/lib/models/project';
  import Command from 'ember-cli/lib/models/command';
  import EmberApp from 'ember-cli/lib/broccoli/ember-app';
  import PreprocessRegistry from 'ember-cli-preprocess-registry';
  import EmberAddon from 'ember-cli/lib/broccoli/ember-addon';
  import {InputNode, Node as BroccoliNode} from 'broccoli-node-api';

  type TransformFn = (tree: InputNode, options: {}) => BroccoliNode;

  interface Transform {
    /**
     * Custom transform.
     */
    transform?: TransformFn;
    /**
     * If you want to process options before being passed into the custom transform function.
     */
    processOptions?: (assetPath: string, entry: any, options: {}) => {};
  }

  interface ImportOptions {
    /**
     * Either 'vendor' or 'test', defaults to 'vendor'
     */
    type?: 'vendor' | 'test';
    /**
     * Whether or not this asset should be prepended, defaults to false
     */
    prepend?: boolean;
    /**
     * Destination directory, defaults to the name of the directory the asset is in
     */
    destDir?: string;
  }

  export default class Addon extends CoreObject {

    /**
     * The name of this addon.
     */
    name: string;
    /**
     * The absolute path of the root directory where this addon is located.
     */
    root: string;
    /**
     * The host app instance.
     * Note: this property will only be present on addons that are a direct dependency of the application itself,
     * not of other addons. It is also not available in init(), but will be set before setupPreprocessorRegistry()
     * and included() are invoked.
     */
    app?: EmberApp;
    /**
     * This addon"s parent.
     * If the addon is a direct dependency of an application, then parent will be the corresponding project instance.
     * If it"s a dependency of another addon, then parent will be a reference to that addon.
     */
    parent: Project | Addon;
    /**
     * The root project to which this addon belongs.
     */
    project: Project;
    /**
     * The set of addons that this addon itself depends on.
     * This array is populated from the addon's listed `dependencies` and any items in `ember-addon.paths`
     * in its `package.json`.
     */
    addons: Addon[];
    /**
     * A `console-ui` object that can be used to log messages for the user and indicate progress on long-running operations.
     */
    ui: UI;
    /**
     * The contents of the addon's `package.json`.
     */
    pkg: {
      name: string;
      version: string;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      // ...
    };

    registry: PreprocessRegistry;
    options?: Record<string, unknown>;

    //
    // Hooks
    //

    /**
     * Augments the applications configuration settings.
     *
     * Object returned from this hook is merged with the application"s configuration object.
     *
     * Application"s configuration always take precedence.
     *
     * @param env Name of current environment (ie "development")
     * @param baseConfig Initial application configuration
     */
    config(env: string, baseConfig: Record<string, any>): Record<string, any>;

    /**
     * Returns the path for addon blueprints.
     */
    blueprintsPath(): string;

    /**
     * Allows the specification of custom addon commands. Expects you to return an object whose key is the name of the command and value is the command instance.
     *
     * This function is not implemented by default
     */
    includedCommands(): Record<string, typeof Command | ExtendOptions<Command>> | void;

    /**
     * Allows addons to define a custom transfrom function that other addons and app can use when using app.import.
     *
     * This function is not implemented by default
     */
    importTransforms(): Record<string, Transform | TransformFn> | void;

    /**
     * This hook allows you to make changes to the express server run by ember-cli.
     *
     * It"s passed a startOptions object which contains:
     * - app Express server instance
     * - options A hash with:
     *    - project Current project
     *    - watcher
     *    - environment
     *
     * This function is not implemented by default
     */
    serverMiddleware(startOptions: { app: Application; options: { project: Project; watcher: any; environment: string } }): Promise<void> | void;

    /**
     * This hook allows you to make changes to the express server run by testem.
     *
     * This function is not implemented by default
     */
    testemMiddleware(app: Application): void;

    /**
     * This hook is called after a build is complete.
     *
     * It"s passed a `result` object which contains: `directory` Path to build output
     */
    postBuild(result: { directory: string }): void;

    /**
     * This hook is called before a build takes place.
     *
     * FIXME fix param types
     */
    preBuild(result: {}): void;

    /**
     * This hook is called after the build has been processed and the build files have been copied to the output directory.
     *
     * It"s passed a `result` object which contains: `directory` Path to build output
     */
    outputReady(result: { directory: string }): void;

    /**
     * This hook is called when an error occurs during the `preBuild`, `postBuild` or `outputReady` hooks for addons,
     * or when the build fails.
     *
     * @param error The error that was caught during the processes listed above
     */
    buildError(error: Error): void;

    /**
     * This method is called when the addon is included in a build. You would typically use this hook to perform additional imports
     *
     * Note: Any options set in the consuming application will override the addon.
     *
     * @param parent The parent object which included this addon
     */
    included(parent: EmberApp | EmberAddon): void;

    /**
     * Can be used to exclude addons from being added as a child addon.
     *
     * @return Whether or not a child addon is supposed to be included
     */
    shouldIncludeChildAddon(childAddon: Addon): boolean;

    /**
     * Used to add preprocessors to the preprocessor registry. This is often used by addons like ember-cli-htmlbars
     * and ember-cli-coffeescript to add a `template` or `js` preprocessor to the registry.
     *
     * @param type either "self" or "parent"
     * @param registry the registry to be set up
     */
    setupPreprocessorRegistry(type: 'self' | 'parent', registry: PreprocessRegistry): void;

    /**
     * Pre-process a tree
     * Uses:
     *    - removing / adding files from the build.
     *
     * @param type What kind of tree (eg. "js", "css", "src", "template")
     * @param tree Tree to process
     */
    preprocessTree(type: 'template' | 'js' | 'css' | 'test', tree: BroccoliNode): BroccoliNode;

    /**
     * Post-process a tree
     *
     * @param type What kind of tree (eg. "js", "css", "src", "template")
     * @param tree Tree to process
     */
    postprocessTree(type: 'template' | 'js' | 'css' | 'test' | 'all', tree: BroccoliNode): BroccoliNode;

    /**
     * Return value is merged into the `tests` tree. This lets you inject linter output as test results.
     */
    lintTree(treeType: 'app' | 'tests' | 'templates' | 'addon', tree: BroccoliNode): BroccoliNode;

    /**
     * Allow addons to implement contentFor method to add string output into the associated
     * `{{content-for "foo"}}` section in `index.html`.
     *
     * FIXME param types
     */
    contentFor(type: any, config: any, content: any): string;

    /**
     * Returns a given type of tree (if present), merged with the application tree. For each of the trees available
     * using this method, you can also use a direct method called `treeFor[Type]` (eg. `treeForApp`).
     *
     * Available tree names:
     * - app
     * - styles
     * - templates
     * - addon-templates
     * - addon
     * - vendor
     * - test-support
     * - addon-test-support
     * - public
     */
    treeFor(name: string): BroccoliNode;

    //
    // Additional `public` methods
    //

    /**
     * Calculates a cacheKey for the given treeType. It is expected to return a cache key allowing multiple builds
     * of the same tree to simply return the original tree (preventing duplicate work).
     * If it returns null / undefined the tree in question will opt out of this caching system.
     *
     * This method is invoked prior to calling treeFor with the same tree name.
     *
     * You should override this method if you implement custom treeFor or treeFor* methods, which cause addons
     * to opt-out of this caching.
     *
     * @return cacheKey
     */
    cacheKeyForTree(treeType: string): string;

    /**
     * FIXME Fix return type
     *
     * @return The addon's dependencies based on the addon's package.json
     */
    dependencies(): {};

    /**
     * Find an addon of the current addon.
     *
     * Example: ember-data depends on ember-cli-babel and wishes to have additional control over transpilation this method helps.
     */
    findOwnAddonByName(addonName: string): Addon;

    /**
     * Check if the current addon intends to be hinted. Typically this is for hinting/linting libraries such as eslint or jshint
     */
    hintingEnabled(): boolean;

    /**
     * Imports an asset into this addon.
     */
    import(asset: string | { development?: string; test?: string; production: string }, options?: ImportOptions): void;

    /**
     * Initializes the addon. If you override this method make sure and call
     * `this._super.init && this._super.init.apply(this, arguments);` or your addon will not work.
     *
     * @param parent The project or addon that directly depends on this addon
     * @param project The current project (deprecated)
     */
    // @ts-ignore
    init(parent: Project | Addon, project: Project): void;

    /**
     * Allows to mark the addon as developing, triggering live-reload in the project the addon is linked to.
     */
    isDevelopingAddon(): boolean;

    /**
     * Whether or not this addon is enabled.
     */
    isEnabled(): boolean;

    /**
     * Returns the module name for this addon.
     */
    moduleName(): string;

    /**
     * Returns a tree for this addon.
     */
    treeForAddon(tree: BroccoliNode): BroccoliNode;

    /**
     * Returns the tree for this addon"s templates.
     */
    treeForAddonTemplates(tree: BroccoliNode): BroccoliNode;

    /**
     * Returns the tree for all test files namespaced to a given addon.
     */
    treeForAddonTemplates(tree: BroccoliNode): BroccoliNode;

    /**
     * Returns the tree for all app files.
     */
    treeForApp(tree: BroccoliNode): BroccoliNode;

    /**
     * Returns the tree for all public files.
     */
    treeForPublic(tree: BroccoliNode): BroccoliNode;

    /**
     * Returns the tree for all style files.
     *
     * @param tree The tree to process, usually `app/styles/` in the addon.
     * @return The return tree has the same contents as the input tree, but is moved so that the `app/styles/` path is preserved.
     */
    treeForStyles(tree: BroccoliNode): BroccoliNode;

    /**
     * Returns the tree for all template files.
     */
    treeForTemplates(tree: BroccoliNode): BroccoliNode;

    /**
     * Returns the tree for all test support files.
     */
    treeForTestSupport(tree: BroccoliNode): BroccoliNode;

    /**
     * Returns the tree for all vendor files.
     */
    treeForVendor(tree: BroccoliNode): BroccoliNode;
  }
}

declare module 'ember-cli/lib/models/command' {

  import CoreObject from 'core-object';
  import UI from 'console-ui';
  import Project from 'ember-cli/lib/models/project';

  interface CommandOption {
    name: string;
    type: unknown;
    description?: string;
    required?: boolean;
    default?: unknown;
    aliases?: string[];
  }

  export default class Command extends CoreObject {

    name: string;
    works: 'insideProject' | 'outsideProject' | 'everywhere';
    description: string;
    availableOptions: CommandOption[];
    anonymousOptions: string[];

    ui: UI;
    project: Project;

    run(options: {}): void | Promise<unknown>;
  }
}

declare module 'ember-cli/lib/models/project' {

  import CoreObject from 'core-object';
  import UI from 'console-ui';
  import Addon from 'ember-cli/lib/models/addon';

  export default class Project extends CoreObject {

    root: string;
    pkg: {
      name: string;
      version: string;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    ui: UI;
    //addons: Addon[];
    //name(): string;

    /**
     * Returns the project root based on the first package.json that is found
     */
    getProjectRoot(): string

    /**
     * Loads the configuration for this project and its addons.
     *
     * @param env Environment name
     */
    config(env: string): unknown;

    /**
     * Generate test file contents.
     *
     * This method is supposed to be overwritten by test framework addons like `ember-qunit` and `ember-mocha`.
     *
     * @param moduleName Name of the test module (e.g. `JSHint`)
     * @param tests Array of tests with `name`, `passed` and `errorMessage` properties
     */
    generateTestFile(moduleName: string, tests: { name: string; passed: boolean; errorMessage?: string }[]): string;

    /**
     * Returns whether or not this is an Ember CLI addon.
     */
    isEmberCLIAddon(): boolean;

    /**
     * Calls `require` on a given module from the context of the project. For instance, an addon may want to require
     * a class from the root project's version of ember-cli.
     *
     * @param filePathOrModuleName File path or module name
     */
    require(filePathOrModuleName: string): unknown;
  }
}
