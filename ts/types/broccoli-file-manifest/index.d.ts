declare module 'broccoli-file-manifest' {

  import {InputNode} from 'broccoli-node-api';
  import TreeWalker, {TreeWalkerOptions} from 'broccoli-tree-walker';

  export interface ManifestOptions extends TreeWalkerOptions {
    /**
     * Default: '{ default: '@import "<file-path>";'}'
     */
    templates?: { [key: string]: string };
    /**
     * Default: 'manifest'
     */
    outputFileNameWithoutExtension?: string;
    /**
     * Default: 'css'
     */
    defaultExtension?: string;
    /**
     * @return -1, 0, 1
     */
    sortMethod?(a: string, b: string): number;
    /**
     * Default: ''
     */
    emptyFile?: string;

    // `directories` cannot be set because it is set to a fixed value (`false`) in `broccoli-file-manifest`
    directories?: never;
  }

  export class Manifest extends TreeWalker {

    constructor(inputNode: InputNode | InputNode[], options?: ManifestOptions);
  }

  export default function manifest(inputNode: InputNode | InputNode[], options?: ManifestOptions): Manifest;
}
