import md5 from 'md5';

const SEPARATOR = '__';
const TERMINATOR = '/';

export function generateClassName(modifiedPath: string, terseClassNames: boolean): string {
  const componentPath = modifiedPath.substr(0, modifiedPath.lastIndexOf(TERMINATOR));
  let className = SEPARATOR + md5(componentPath).slice(-5);

  if (!terseClassNames) {
    className = SEPARATOR + componentPath.replace(/\//g, SEPARATOR) + className;
  }

  return className;
}
