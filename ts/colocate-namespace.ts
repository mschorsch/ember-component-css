import funnel from 'broccoli-funnel';
import mergeTrees from 'broccoli-merge-trees';
import {default as generateManifest, Manifest} from 'broccoli-file-manifest';
import {NamespaceStyles as BroccoliNamespaceStyles} from './namespace-styles';
import {ScopeTemplates} from './scope-templates';
import {StyleInfo} from './style-info';
import {InputNode, Node as BroccoliNode} from 'broccoli-node-api';
import {PreprocessPlugin, PreprocessPluginJsCss} from 'ember-cli-preprocess-registry';

interface Options {
  getExtentions(extension: string): Array<string>; // FIXME
  baseNode: InputNode;
  terseClassNames?: boolean;
}

abstract class BaseStyles {

  private readonly getExtentions: (extension: string) => Array<string>;
  private readonly baseNode: InputNode;
  protected readonly terseClassNames: boolean;

  private _extentions?: Array<string>;

  constructor(options: Options) {
    this.getExtentions = options.getExtentions;
    this.baseNode = options.baseNode;
    this.terseClassNames = options.terseClassNames ?? false;
  }

  get name(): string {
    return '';
  }

  get extentions(): Array<string> {
    if (!this._extentions) {
      this._extentions = this.getExtentions('css');
    }
    return this._extentions;
  }

  get colocatedStyles(): BroccoliNode {
    return funnel(this.baseNode, {
      include: [`**/*.{${this.extentions},}`],
      exclude: ['styles/**/*'],
      allowEmpty: true,
      annotation: 'Funnel (ember-component-css grab files addon style files)',
    });
  }

  treeToLocation(destDir: string | undefined, tooToBePlaced: InputNode, ...trees: InputNode[]): BroccoliNode {
    const placedTree = funnel(tooToBePlaced, {destDir});
    return mergeTrees(trees.concat(placedTree), {overwrite: true});
  }
}

const MANIFEST_TEMPATES = {
  default: '@import "<file-path>";',
  sass: '@import "<file-path>"',
  styl: '@import "<file-path>"',
}

export class ColocateStyles extends BaseStyles implements PreprocessPluginJsCss {

  get name(): string {
    return 'colocate-styles';
  }

  toTree(tree: InputNode, inputPath: string): BroccoliNode {
    const projectStyles = this.generateManifest(this.colocatedStyles);
    return this.treeToLocation(inputPath, projectStyles, tree);
  }

  private generateManifest(tree: InputNode): BroccoliNode {
    const manifest: Manifest = generateManifest(tree, {
      outputFileNameWithoutExtension: 'ember-styles',
      templates: MANIFEST_TEMPATES,
      annotation: 'Manifest (ember-component-css style file manifest)',
    });

    return mergeTrees([tree, manifest]);
  }
}

export class NamespaceStyles extends BaseStyles implements PreprocessPluginJsCss {

  get name(): string {
    return 'namespace-styles';
  }

  toTree(tree: InputNode, inputPath: string): BroccoliNode {
    const projectStyles = funnel(tree, {
      exclude: ['ember-styles.*', 'app.*', 'addon.*'],
      srcDir: inputPath,
      allowEmpty: true,
    });

    const namespacedProjectStyles = this.namespaceStyles(projectStyles);
    return this.treeToLocation(inputPath, namespacedProjectStyles, tree);
  }

  private namespaceStyles(tree: InputNode): BroccoliNode {
    return new BroccoliNamespaceStyles(tree, {
      extensions: this.extentions,
      terseClassNames: this.terseClassNames,
      annotation: 'Filter (ember-component-css process root & or :--component with class name)',
    });
  }
}

export class ColocatedNamespaceObjects extends BaseStyles implements PreprocessPluginJsCss {

  get name(): string {
    return 'colocate-and-namespace-styles-in-js';
  }

  toTree(tree: InputNode, _inputPath: string, outputPath: string): BroccoliNode {
    const generatedFiles = new StyleInfo(this.colocatedStyles, {
      terseClassNames: this.terseClassNames,
    });

    return this.treeToLocation(outputPath, generatedFiles, tree);
  }
}

export class ColocatedNamespaceTemplates extends BaseStyles implements PreprocessPlugin {

  get name(): string {
    return 'colocate-and-namespace-styles-in-templates-only';
  }

  toTree(tree: BroccoliNode): BroccoliNode {
    const scopedTemplates = new ScopeTemplates(tree, {
      terseClassNames: this.terseClassNames,
    });

    return this.treeToLocation(undefined, scopedTemplates, tree);
  }
}
