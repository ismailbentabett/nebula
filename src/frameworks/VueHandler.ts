import { promises as fs } from 'fs';
import glob from 'glob';
import path from 'path';
import { extractClassesAndIdsFromTemplate } from '../utils/ClassExtractor';
import { NebulaConfig } from '../utils/Config';
import { injectCssImport } from '../utils/FileUtils';
import { FrameworkHandler } from './FrameworkHandler';

export class VueHandler implements FrameworkHandler {
  private config: NebulaConfig;

  constructor(config: NebulaConfig) {
    this.config = config;
  }

  async findComponentFiles(projectDir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob(
        `${projectDir}/**/*.vue`,
        { ignore: this.config.exclude },
        (err, files) => {
          if (err) {
            return reject(err);
          }
          // Filter files based on include patterns if provided
          const filteredFiles = this.config.include.length
            ? files.filter((file) =>
                this.config.include.some((pattern) => file.includes(pattern))
              )
            : files;
          resolve(filteredFiles);
        }
      );
    });
  }

  async extractClassesAndIds(
    filePath: string
  ): Promise<{ classes: string[]; ids: string[] }> {
    const content = await fs.readFile(filePath, 'utf-8');
    return extractClassesAndIdsFromTemplate(
      content,
      /<template[^>]*>([\s\S]*?)<\/template>/g,
      this.config
    );
  }

  async injectCssImport(filePath: string, cssFileName: string): Promise<void> {
    const cssImport = `<style src="./${cssFileName}"></style>`;
    await injectCssImport(filePath, cssImport);
  }

  getComponentName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }
}