import Filter from 'broccoli-persistent-filter';
import {generateClassName} from './component-names';
import path from 'path';
import {InputNode} from 'broccoli-node-api';
import postcss from 'postcss';
import postcssSelectorNamespace from 'postcss-selector-namespace';
import {EOL} from 'os';

const SUPPORTED_EXTENSIONS = {
  '.scss': require('postcss-scss'),
  '.less': require('postcss-less')
};

interface Options {
  annotation?: string;
  extensions?: string[];
  terseClassNames: boolean;
}

export class NamespaceStylesFilter extends Filter {

  private readonly terseClassNames: boolean;

  constructor(tree: InputNode, options: Options) {
    super(tree, {
      annotation: options.annotation,
      extensions: options.extensions,
    });

    this.terseClassNames = options.terseClassNames;
  }

  processString(contents: string, stylePath: string): string {
    const extension = path.extname(stylePath);
    const generatedClassName = generateClassName(stylePath, this.terseClassNames);

    switch (extension) {
      case '.styl':
      case '.sass':
        return indentStyles(contents, generatedClassName);
      case '.less':
      case '.scss':
        return syntaxStyles(contents, generatedClassName, extension);
    }

    return defaultStyles(contents, generatedClassName);
  }
}

function indentStyles(contents: string, className: string): string {
  contents = contents.replace(/:--component/g, '&');
  contents = '.' + className + EOL + contents;

  // Indent styles for scoping and make sure it ends with a
  // newline that is not indented
  return contents.replace(new RegExp(EOL, 'g'), EOL + '  ') + EOL;
}

// function wrap(contents: string, className: string): string {
//   // Replace instances of :--component with '&'
//   contents = contents.replace(/:--component/g, '&');
//
//   // Wrap the styles inside the generated class
//   return `.${className} { ${contents} }`;
// }

function syntaxStyles(contents: string, className: string, extension: '.scss' | '.less'): string {
  return postcss().use(namespaceSelectors(className))
    .process(contents, {
      syntax: SUPPORTED_EXTENSIONS[extension]
    }).css;
}

function defaultStyles(contents: string, className: string): string {
  return postcss().use(namespaceSelectors(className)).process(contents).css;
}

function namespaceSelectors(className: string): postcss.AcceptedPlugin {
  return postcssSelectorNamespace({
    selfSelector: /&|:--component/,
    namespace: '.' + className,
    ignoreRoot: false
  });
}
