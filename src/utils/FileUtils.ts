import { promises as fs } from 'fs';
import path from 'path';

export async function generateCssForComponent(
  componentFilePath: string,
  extractedStyles: string,
  cssFileName: string
): Promise<void> {
  const componentDir = path.dirname(componentFilePath);
  const cssFilePath = path.join(componentDir, cssFileName);

  await fs.writeFile(cssFilePath, extractedStyles);
}

export async function injectCssImport(
  filePath: string,
  cssImport: string
): Promise<void> {
  const content = await fs.readFile(filePath, 'utf-8');
  if (!content.includes(cssImport)) {
    const updatedContent = `${content}\n\n${cssImport}`;
    await fs.writeFile(filePath, updatedContent);
  }
}
