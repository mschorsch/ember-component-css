/**
 * Helper base class for Broccoli plugins that map input files into output files.
 * Except with a persistent cache to fast restarts. one-to-one.
 *
 * https://github.com/broccolijs/broccoli-persistent-filter
 */
declare module 'broccoli-persistent-filter' {

  import Plugin from 'broccoli-plugin';
  import {InputNode} from 'broccoli-node-api';

  interface PersistentFilterOptions {
    /**
     * A descriptive annotation. Useful for debugging, to tell multiple instances of the same plugin apart.
     */
    annotation?: string;
    /**
     * Whether the `create` and `change` file operations are allowed to complete asynchronously (true|false, default: false)
     */
    async?: boolean;
    /**
     * Used with `async: true`. The number of operations that can be run concurrently.
     * This overrides the value set with `JOBS=n` environment variable.
     * (default: the number of detected CPU cores - 1, with a min of 1)
     */
    concurrency?: number;
    /**
     * An array of file extensions to process, e.g. `['md', 'markdown']`.
     */
    extensions?: string[];
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
     * The character encoding used for writing output files after processing (default: `'utf8'`).
     * For binary files, pass `null` and return a `Buffer` object from `processString`.
     */
    outputEncoding?: string;
    /**
     *  Defaults to `false`. When `true`, causes the plugin to cache the results of processing a file to disk so that
     *  it can be re-used during the next build.
     */
    persist?: boolean;
    /**
     * The file extension of the corresponding output files, e.g. `'html'`.
     */
    targetExtension?: string;
  }

  class Filter extends Plugin {
    /**
     * Enforces that it is invoked on an instance of a class which prototypically
     * inherits from Filter, and which is not itself Filter.
     */
    constructor(inputNode: InputNode, options?: PersistentFilterOptions);

    /**
     * method `processString`: must be implemented on subclasses of
     * Filter.
     *
     * The resolved return value can either be an object or a string.
     *
     * An object can be used to cache additional meta-data that is not part of the
     * final output. When an object is returned, the `.output` property of that
     * object is used as the resulting file contents.
     *
     * When a string is returned it is used as the file contents.
     */
    processString(contents: string, relativePath: string): string | object;

    /**
     * Method `getDestFilePath`: determine whether the source file should
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

    /**
     * Method `postProcess`: may be implemented on subclasses of
     * Filter.
     *
     * This method can be used in subclasses to do processing on the results of
     * each files `processString` method.
     *
     * A common scenario for this is linting plugins, where on initial build users
     * expect to get console warnings for lint errors, but we do not want to re-lint
     * each file on every boot (since most of them will be able to be served from the
     * cache).
     *
     * The `.output` property of the return value is used as the emitted file contents.
     */
    postProcess(results: object, relativePath: string): object;
  }

  export = Filter;
}
