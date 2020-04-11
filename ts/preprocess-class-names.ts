import postcss from 'postcss';
import postcssSelectorNamespace from 'postcss-selector-namespace';
import {EOL} from 'os';

// FIXME require
const supportedExtensions = {
  '.scss': require('postcss-scss'),
  '.less': require('postcss-less')
};

function namespaceSelectors(className: string): postcss.AcceptedPlugin {
  return postcssSelectorNamespace({
    selfSelector: /&|:--component/,
    namespace: '.' + className,
    ignoreRoot: false
  });
}

export function indentation(contents: string, className: string): string {
  contents = contents.replace(/:--component/g, '&');
  contents = '.' + className + EOL + contents;

  // Indent styles for scoping and make sure it ends with a
  // newline that is not indented
  return contents.replace(new RegExp(EOL, 'g'), EOL + '  ') + EOL;
}

// FIXME unused
export function wrap(contents: string, className: string): string {
  // Replace instances of :--component with '&'
  contents = contents.replace(/:--component/g, '&');

  // Wrap the styles inside the generated class
  return '.' + className + '{' + contents + '}';
}

export function syntax(contents: string, className: string, extension: '.scss' | '.less'): string {
  return postcss().use(namespaceSelectors(className))
    .process(contents, {
      syntax: supportedExtensions[extension]
    }).css;
}

// FIXME
export function defaultX(contents: string, className: string): string {
  return postcss().use(namespaceSelectors(className)).process(contents).css;
}
