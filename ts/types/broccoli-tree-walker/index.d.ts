declare module 'broccoli-tree-walker' {

  import {InputNode} from 'broccoli-node-api';
  import Plugin from 'broccoli-plugin';
  import {PluginOptions} from 'broccoli-plugin/interfaces';
  import {IMinimatch} from 'minimatch';
  import FSTree from 'fs-tree-diff';

  export interface TreeWalkerOptions extends PluginOptions {
    /**
     *  Entry option globs from node-walk-sync
     */
    include?: (string | IMinimatch)[]; // globs
    /**
     * Entry option ignore from node-walk-sync
     */
    exclude?: (string | IMinimatch)[]; // ignore
    /**
     *  Entry option directories from node-walk-sync
     */
    directories?: boolean;

    // `persistentOutput` cannot be set because it is set to a fixed value (`true`) in `broccoli-tree-walker`
    persistentOutput?: never;
  }

  export default class TreeWalker extends Plugin {

    constructor(inputNode: InputNode | InputNode[], options?: TreeWalkerOptions);

    /**
     * Virtual method `unlink`: Called when you remove the specified file
     */
    unlink(filePath: string, rootPath: string): void;

    /**
     * Virtual method `rmdir`: Called when you remove the specified folder
     */
    rmdir(filePath: string, rootPath: string): void;

    /**
     * Virtual method `mkdir`: Called when you create the specified folder
     */
    mkdir(filePath: string, rootPath: string): void;

    /**
     * Virtual method `create`: Called when you create the specified file
     */
    create(filePath: string, rootPath: string): void;

    /**
     * Virtual method `change`: Called when you update the specified file to reflect changes
     */
    change(filePath: string, rootPath: string): void;

    /**
     * Virtal method `nodesChanged` Called when a change has been made to one of the input nodes
     */
    nodesChanged(patchResults: Array<FSTree.Patch>): void;
  }
}
