import { promises as fs } from 'fs';
import glob from 'glob';
import path from 'path';
import { extractClassesAndIdsFromTemplate } from '../utils/ClassExtractor';
import { NebulaConfig } from '../utils/Config';
import { FrameworkHandler } from './FrameworkHandler';

export class AngularHandler implements FrameworkHandler {
  private config: NebulaConfig;

  constructor(config: NebulaConfig) {
    this.config = config;
  }

  async findComponentFiles(projectDir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob(
        `${projectDir}/**/*.component.{ts,html}`,
        { ignore: this.config.exclude },
        (err, files) => {
          if (err) {
            return reject(err);
          }
          const filteredFiles = this.config.include.length
            ? files.filter((file) => this.config.include.some((pattern) => file.includes(pattern)))
            : files;
          resolve(filteredFiles);
        }
      );
    });
  }

  async extractClassesAndIds(filePath: string): Promise<{ classes: string[]; ids: string[] }> {
    const content = await fs.readFile(filePath, 'utf-8');
    if (filePath.endsWith('.html')) {
      return extractClassesAndIdsFromTemplate(content, /([\s\S]*)/g, this.config);
    } else {
      // Extract templateUrl and inline templates from .ts files
      // This requires more complex parsing which is simplified here
      return { classes: [], ids: [] };
    }
  }

  async injectCssImport(filePath: string, cssFileName: string): Promise<void> {
    if (filePath.endsWith('.ts')) {
      const content = await fs.readFile(filePath, 'utf-8');
      const updatedContent = content.replace(
        /styleUrls:\s*\[([^\]]*)\]/,
        `styleUrls: ['$1', './${cssFileName}']`
      );
      await fs.writeFile(filePath, updatedContent);
    }
  }

  getComponentName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }
}