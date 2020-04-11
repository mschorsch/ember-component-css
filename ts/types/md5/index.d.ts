/**
 * A JavaScript function for hashing messages with MD5.
 *
 * https://github.com/pvorb/node-md5
 */
declare module 'md5' {

  function md5(message: string | Buffer | Uint8Array, options?: { encoding?: 'binary'; asBytes?: boolean; asString?: boolean }): string

  export = md5
}
