import sass from 'sass';
import { NebulaConfig } from './Config';

export function compileSass(
  filePath: string,
  outputStyle: 'expanded' | 'compressed'
): string {
  const result = sass.renderSync({
    file: filePath,
    outputStyle,
  });
  return result.css.toString();
}

export function extractStylesForClasses(
  css: string,
  classes: string[],
  config: NebulaConfig
): string {
  let extractedStyles = '';
  classes.forEach((className) => {
    const escapedClassName = escapeRegExp(className);
    const regex = new RegExp(`\\.${escapedClassName}\\b[^{]*{[^}]*}`, 'g');
    const matches = css.match(regex);
    if (matches) {
      extractedStyles += matches.join('\n') + '\n\n';
    }
  });
  return extractedStyles;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
