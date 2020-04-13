import fs from 'fs-extra';
import path from 'path';
import {generateClassName} from './component-names';
import TreeWalker, {TreeWalkerOptions} from 'broccoli-tree-walker';
import {InputNode} from 'broccoli-node-api';

// FIXME Find a better solution

interface StyleInfoOptions extends TreeWalkerOptions {
  terseClassNames: boolean;
}

export class StyleInfo extends TreeWalker {

  private readonly terseClassNames: boolean;

  constructor(tree: InputNode, options: StyleInfoOptions) {
    super(tree, options);

    this.terseClassNames = options.terseClassNames;
  }

  create(stylePath: string, _rootPath: string): void {
    const styleNamespace = generateClassName(stylePath, this.terseClassNames);
    const styleFileContent = fileContents(styleNamespace);
    const fullStyleFilePath = this.fullStylePath(stylePath)
    return fs.outputFileSync(fullStyleFilePath, styleFileContent);
  }

  unlink(stylePath: string, _rootPath: string): void {
    const fullStyleFilePath = this.fullStylePath(stylePath)
    return fs.removeSync(fullStyleFilePath);
  }

  private fullStylePath(stylePath: string): string {
    return path.join(this.outputPath, path.dirname(stylePath), 'styles.js');
  }
}

function fileContents(styleNamespace: string): string {
  return `
      import EmberObject from '@ember/object';

      export const styleNamespace = "${styleNamespace}"
      export default class extends EmberObject { styleNamespace = styleNamespace };
    `;
}
