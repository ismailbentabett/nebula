import { NebulaConfig } from './Config';

export async function extractClassesAndIdsFromTemplate(
  content: string,
  templateRegex: RegExp,
  config: NebulaConfig
): Promise<{ classes: string[]; ids: string[] }> {
  const classes = new Set<string>();
  const ids = new Set<string>();

  const templates = [...content.matchAll(templateRegex)];
  if (!templates.length) return { classes: [], ids: [] };

  for (const templateMatch of templates) {
    const templateContent = templateMatch[1];
    const classRegex = /class=["']([^"']+)["']/g;
    const idRegex = /id=["']([^"']+)["']/g;

    let match;
    while ((match = classRegex.exec(templateContent)) !== null) {
      match[1].split(/\s+/).forEach((cls) => {
        if (!isBootstrapClass(cls.trim(), config.bootstrapPrefixes)) {
          classes.add(cls.trim());
        }
      });
    }

    while ((match = idRegex.exec(templateContent)) !== null) {
      ids.add(match[1].trim());
    }
  }

  return { classes: Array.from(classes), ids: Array.from(ids) };
}

function isBootstrapClass(className: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => className.startsWith(prefix));
}
