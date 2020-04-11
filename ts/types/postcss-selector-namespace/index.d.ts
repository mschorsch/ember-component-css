declare module 'postcss-selector-namespace' {

  import postcss from 'postcss';

  interface Options {
    /**
     * The selector to prepend to each selector.
     *
     * (default: `'.self'`)
     */
    namespace?: string;

    /**
     * The selector to use to apply rules directly to your namespace selector.
     *
     * (default: `:--namespace`)
     */
    selfSelector?: string | RegExp;

    /**
     * Selector won't be namespaced if they start with the `:root` pseudo-class.
     *
     * (default: `true`)
     */
    ignoreRoot?: boolean;

    /**
     * If prefixed with this selector, selectors won't be namespaced.
     *
     * (default: `:root`)
     */
    rootSelector?: string | RegExp;

    /**
     * If `true`, the `rootSelector` will be stripped from the output.
     * (default: `true`)
     */
    dropRoot?: boolean;
  }

  function postcssSelectorNamespace(options?: Options): postcss.AcceptedPlugin;

  export = postcssSelectorNamespace;
}
