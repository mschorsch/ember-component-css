/**
 * Used by Ember CLI to provide a registry of preprocessors.
 * The main types used throughout the system are `css`, `template`, `js`.
 */
declare module 'ember-cli-preprocess-registry' {

  import {Node as BroccoliNode} from 'broccoli-node-api';

  interface PreprocessPlugin {
    name: string;
    toTree(tree: BroccoliNode /*, options */): BroccoliNode;
  }

  interface PreprocessPluginJsCss {
    name: string;
    toTree(tree: BroccoliNode, inputPath: string, outputPath: string /*, options */): BroccoliNode;
  }

  class PreprocessRegistry {
    /**
     * Adds the provided plugin to the registry for the type specified.
     */
    add(type: 'js' | 'css', plugin: PreprocessPluginJsCss): void;
    add(type: string, plugin: PreprocessPlugin): void;

    /**
     * Returns an array of all plugins that are registered for a given type.
     */
    load(type: 'js' | 'css'): Array<PreprocessPluginJsCss>;
    load(type: string): Array<PreprocessPlugin>;

    /**
     * Returns an array of all known extensions for a given type.
     */
    extensionsForType(type: string): Array<string>;

    /**
     * Removes the provided plugin from the specified type listing.
     */
    remove(type: 'js' | 'css', plugin: PreprocessPluginJsCss): void;
    remove(type: string, plugin: PreprocessPlugin): void;
  }

  export = PreprocessRegistry;
}
