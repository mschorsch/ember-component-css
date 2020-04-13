import Filter from 'broccoli-persistent-filter';
import {generateClassName} from './component-names';
import {InputNode} from 'broccoli-node-api';

interface ScopeTemplatesOptions {
  annotation?: string;
  terseClassNames: boolean;
}

export class ScopeTemplatesFilter extends Filter {

  private readonly terseClassNames: boolean;

  constructor(tree: InputNode, options: ScopeTemplatesOptions) {
    super(tree, {
      annotation: options.annotation,
      extensions: ['hbs'],
      targetExtension: 'hbs',
    });

    this.terseClassNames = options.terseClassNames;
  }

  processString(contents: string, stylePath: string): string {
    const className = generateClassName(stylePath, this.terseClassNames);

    return `{{#let (if this.styleNamespace this.styleNamespace '${className}') as |styleNamespace|}}${contents}{{/let}}`
  }
}
