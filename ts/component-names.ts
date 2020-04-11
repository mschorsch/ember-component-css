import md5 from 'md5';

export function generateClassName(modifiedPath: string, terseClassNames: boolean): string {
  const seperator = '__';
  const componentPath = path(modifiedPath);
  let className = seperator + md5(componentPath).slice(-5);

  if (!terseClassNames) {
    className = seperator + componentPath.replace(/\//g, seperator) + className;
  }

  return className;
}

function path(actualPath: string): string {
  const terminator = '/';
  return actualPath.substr(0, actualPath.lastIndexOf(terminator));
}
