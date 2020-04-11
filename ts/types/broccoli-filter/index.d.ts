/**
 * Helper base class for Broccoli plugins that map input files into output files one-to-one.
 *
 * https://github.com/broccolijs/broccoli-filter
 */
declare module 'broccoli-filter' {

  import Plugin from 'broccoli-plugin';
  import {InputNode} from 'broccoli-node-api';

  interface FilterOptions {
    /**
     * An array of file extensions to process, e.g. `['md', 'markdown']`.
     */
    extensions?: string[];
    /**
     * The file extension of the corresponding output files, e.g. `'html'`.
     */
    targetExtension?: string;
    /**
     * The character encoding used for reading input files to be processed (default: `'utf8'`).
     * For binary files, pass `null` to receive a `Buffer` object in `processString`.
     */
    inputEncoding?: string;

    /**
     * The name of this plugin class. Defaults to `this.constructor.name`.
     */
    name?: string;

    /**
     * A descriptive annotation. Useful for debugging, to tell multiple instances of the same plugin apart.
     */
    annotation?: string;
  }

  export class Filter extends Plugin {
    /**
     * Enforces that it is invoked on an instance of a class which prototypically
     * inherits from Filter, and which is not itself Filter.
     */
    constructor(inputNode: InputNode, options?: FilterOptions);

    /**
     * Abstract method `processString`: must be implemented on subclasses of Filter.
     *
     * The return value is written as the contents of the output file
     */
    processString(contents: string, relativePath: string): string;

    /**
     * Virtual method `getDestFilePath`: determine whether the source file should
     * be processed, and optionally rename the output file when processing occurs.
     *
     * Return `null` to pass the file through without processing. Return
     * `relativePath` to process the file with `processString`. Return a
     * different path to process the file with `processString` and rename it.
     *
     * By default, if the options passed into the `Filter` constructor contain a
     * property `extensions`, and `targetExtension` is supplied, the first matching
     * extension in the list is replaced with the `targetExtension` option's value.
     */
    getDestFilePath(relativePath: string): string;
  }

  export default function filter(inputNode: InputNode, options: FilterOptions): Filter;
}
