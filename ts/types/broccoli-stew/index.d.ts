declare module 'broccoli-stew' {

  import {InputNode, Node as BroccoliNode} from 'broccoli-node-api';
  import Plugin from 'broccoli-plugin';

  // TODO env
  // TODO mv
  // TODO rename

  type PathMatcherFn = (path: string) => boolean;
  type Matcher = string | RegExp | PathMatcherFn;

  interface FindOptions {
    include?: Matcher[];
    exclude?: Matcher[];
    overwrite?: boolean;
  }

  export function find(tree: InputNode | InputNode[], filter?: Matcher | FindOptions): BroccoliNode;

  // TODO map

  interface LogOptions {
    /**
     * Will label the the tree in stdout
     */
    label?: string;
    /**
     * Print to stdout as a tree
     */
    output?: 'tree';
  }

  export function log(tree: InputNode, options?: string | LogOptions): BroccoliNode;

  export function debug(tree: InputNode, options?: string | { name: string }): BroccoliNode;

  // TODO rm

  export function afterBuild(tree: InputNode, callback: (this: Plugin) => void): BroccoliNode;

  // TODO npm.main
}
