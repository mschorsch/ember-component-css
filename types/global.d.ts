// Types for compiled templates
declare module 'ember-component-css/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module '*/template' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const template: TemplateFactory;
  export default template;
}
