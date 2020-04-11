import Filter from 'broccoli-persistent-filter';
import {generateClassName} from './component-names';
import {defaultX, indentation, syntax} from './preprocess-class-names';
import path from 'path';
import {InputNode} from 'broccoli-node-api';

interface Options {
  annotation?: string;
  extensions?: string[];
  terseClassNames: boolean;
}

export class NamespaceStyles extends Filter {

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
    const className = generateClassName(stylePath, this.terseClassNames);

    switch (extension) {
      case '.styl':
      case '.sass':
        return indentation(contents, className);
      case '.less':
      case '.scss':
        return syntax(contents, className, extension);
    }

    return defaultX(contents, className);
  }
}
